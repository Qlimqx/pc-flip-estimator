// @vitest-environment node
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { rename } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { acquireLock, createTransaction, mergeJsonl } from '../lib/store.mjs'

async function tmp() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'pcflip-store-'))
  await mkdir(path.join(root, 'data'), { recursive: true })
  await writeFile(path.join(root, 'data/a.json'), '{"v":1}\n')
  await writeFile(path.join(root, 'data/b.json'), '{"v":1}\n')
  return root
}
const txFor = (root, fsOps) => createTransaction({ root, backupDir: path.join(root, '.bk'), fsOps })
const text = (root, rel) => readFile(path.join(root, rel), 'utf8')

describe('transaction de fichiers', () => {
  it('applique toutes les écritures et sauvegarde les anciens contenus', async () => {
    const root = await tmp()
    const tx = txFor(root)
    tx.stageJson('data/a.json', { v: 2 })
    tx.stageJson('data/new.json', { v: 9 })
    await tx.commit()
    expect(JSON.parse(await text(root, 'data/a.json'))).toEqual({ v: 2 })
    expect(JSON.parse(await text(root, 'data/new.json'))).toEqual({ v: 9 })
    expect(await text(root, '.bk/data/a.json')).toBe('{"v":1}\n')
  })

  it('une erreur d\'écriture ne modifie AUCUN fichier', async () => {
    const root = await tmp()
    let n = 0
    const tx = txFor(root, {
      writeFile: async (...args) => {
        n += 1
        if (n === 2) throw new Error('disque plein')
        return (await import('node:fs/promises')).writeFile(...args)
      },
    })
    tx.stageJson('data/a.json', { v: 2 })
    tx.stageJson('data/b.json', { v: 2 })
    await expect(tx.commit()).rejects.toThrow(/aucun fichier modifié/)
    expect(await text(root, 'data/a.json')).toBe('{"v":1}\n')
    expect(await text(root, 'data/b.json')).toBe('{"v":1}\n')
  })

  it('une erreur de renommage restaure les fichiers déjà remplacés', async () => {
    const root = await tmp()
    let n = 0
    const tx = txFor(root, {
      rename: async (from, to) => {
        n += 1
        if (n === 2) throw new Error('EPERM')
        return rename(from, to)
      },
    })
    tx.stageJson('data/a.json', { v: 2 })
    tx.stageJson('data/b.json', { v: 2 })
    await expect(tx.commit()).rejects.toThrow(/restaurés/)
    expect(await text(root, 'data/a.json')).toBe('{"v":1}\n')
    expect(await text(root, 'data/b.json')).toBe('{"v":1}\n')
  })
})

describe('verrou d\'exécution', () => {
  it('refuse une seconde exécution simultanée', async () => {
    const root = await tmp()
    const lockFile = path.join(root, '.lock')
    const first = await acquireLock(lockFile, { owner: 'run-1' })
    expect(first.acquired).toBe(true)
    const second = await acquireLock(lockFile, { owner: 'run-2' })
    expect(second.acquired).toBe(false)
    expect(second.heldBy).toBe('run-1')
    await first.release()
    const third = await acquireLock(lockFile, { owner: 'run-3' })
    expect(third.acquired).toBe(true)
  })

  it('reprend un verrou abandonné depuis trop longtemps', async () => {
    const root = await tmp()
    const lockFile = path.join(root, '.lock')
    await acquireLock(lockFile, { owner: 'mort', now: () => 1000 })
    const next = await acquireLock(lockFile, { owner: 'vivant', now: () => 1000 + 4 * 3600 * 1000 })
    expect(next.acquired).toBe(true)
  })
})

describe('historique JSONL', () => {
  it('n\'ajoute jamais deux fois la même date et le même composant', () => {
    const key = (r) => `${r.date}|${r.key}`
    const a = mergeJsonl('', [{ date: 'd1', key: 'k1', v: 1 }], key)
    expect(a.added).toBe(1)
    const b = mergeJsonl(a.text, [{ date: 'd1', key: 'k1', v: 2 }, { date: 'd1', key: 'k2', v: 3 }], key)
    expect(b.added).toBe(1)
    expect(b.text.trim().split('\n')).toHaveLength(2)
    expect(b.text).toContain('"v":1') // l'existant n'est pas écrasé
  })

  it('conserve une ligne illisible au lieu de la supprimer', () => {
    const r = mergeJsonl('pas du json\n', [{ date: 'd', key: 'k' }], (x) => `${x.date}|${x.key}`)
    expect(r.text.split('\n')[0]).toBe('pas du json')
  })
})
