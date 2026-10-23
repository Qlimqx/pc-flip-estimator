// Stockage de l'agent : des fichiers versionnés dans Git (la « base de
// données » de ce projet statique), modifiés par TRANSACTION.
//
// Une transaction accumule des écritures en mémoire (`stage`), puis `commit`
// les applique ainsi :
//   1. sauvegarde de l'état actuel de chaque fichier concerné (dossier de
//      sauvegarde du run, exposé en artefact par le workflow) ;
//   2. écriture de chaque fichier dans un fichier temporaire voisin ;
//   3. renommage atomique de chaque temporaire sur sa cible ;
//   4. au moindre échec : restauration des fichiers déjà remplacés depuis la
//      sauvegarde -> soit tout est appliqué, soit rien.
// Les erreurs d'écriture ne peuvent donc jamais laisser un catalogue à moitié
// modifié.

import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { open } from 'node:fs/promises'
import path from 'node:path'

export async function readText(file, fallback = null) {
  try {
    return await readFile(file, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') return fallback
    throw err
  }
}

export async function readJsonStrict(file, fallback) {
  const text = await readText(file, null)
  if (text === null) return fallback
  try {
    return JSON.parse(text)
  } catch (err) {
    throw new Error(`JSON corrompu dans ${file} : ${err.message}`)
  }
}

export const toJson = (value) => `${JSON.stringify(value, null, 2)}\n`

/**
 * @param {object} opts
 * @param {string} opts.root        racine du dépôt
 * @param {string} opts.backupDir   dossier (hors versionnement) pour les sauvegardes
 * @param {{writeFile?:Function, rename?:Function}} [opts.fsOps]  injection pour les tests de panne
 */
export function createTransaction({ root, backupDir, fsOps = {} }) {
  const doWrite = fsOps.writeFile ?? writeFile
  const doRename = fsOps.rename ?? rename
  const staged = new Map() // chemin relatif -> contenu texte

  return {
    stage(rel, content) {
      staged.set(rel, content)
    },
    stageJson(rel, value) {
      staged.set(rel, toJson(value))
    },
    /** Contenu en attente (pour relire ce qu'on vient de préparer). */
    peek(rel) {
      return staged.get(rel)
    },
    get size() {
      return staged.size
    },
    /** Applique toutes les écritures ou aucune. */
    async commit() {
      if (staged.size === 0) return { files: [] }
      const originals = new Map()
      for (const rel of staged.keys()) {
        originals.set(rel, await readText(path.join(root, rel), null))
      }
      // 1. sauvegarde
      for (const [rel, text] of originals) {
        if (text === null) continue
        const dest = path.join(backupDir, rel)
        await mkdir(path.dirname(dest), { recursive: true })
        await writeFile(dest, text)
      }
      // 2. écriture des temporaires
      const tmpFiles = []
      try {
        for (const [rel, content] of staged) {
          const target = path.join(root, rel)
          await mkdir(path.dirname(target), { recursive: true })
          const tmp = `${target}.agent-tmp`
          await doWrite(tmp, content)
          tmpFiles.push({ rel, tmp, target })
        }
      } catch (err) {
        await Promise.all(tmpFiles.map((t) => rm(t.tmp, { force: true })))
        throw new Error(`écriture annulée (aucun fichier modifié) : ${err.message}`)
      }
      // 3. renommages ; 4. restauration en cas d'échec
      const replaced = []
      try {
        for (const t of tmpFiles) {
          await doRename(t.tmp, t.target)
          replaced.push(t)
        }
      } catch (err) {
        for (const t of replaced) {
          const original = originals.get(t.rel)
          if (original === null) await rm(t.target, { force: true })
          else await writeFile(t.target, original)
        }
        await Promise.all(tmpFiles.map((t) => rm(t.tmp, { force: true })))
        throw new Error(`transaction annulée, fichiers restaurés : ${err.message}`)
      }
      staged.clear()
      return { files: tmpFiles.map((t) => t.rel) }
    },
  }
}

/**
 * Verrou d'exécution (empêche deux runs simultanés sur la même copie du
 * dépôt). Entre runners GitHub distincts, c'est le groupe `concurrency` du
 * workflow qui joue ce rôle ; ce verrou protège les lancements locaux et
 * manuels. Un verrou plus vieux que `staleMs` est considéré comme abandonné.
 */
export async function acquireLock(lockFile, { now = Date.now, staleMs = 3 * 3600 * 1000, owner = String(process.pid) } = {}) {
  await mkdir(path.dirname(lockFile), { recursive: true })
  const tryCreate = async () => {
    const handle = await open(lockFile, 'wx')
    await handle.writeFile(JSON.stringify({ owner, at: now() }))
    await handle.close()
  }
  try {
    await tryCreate()
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
    const existing = JSON.parse((await readText(lockFile, '{}')) || '{}')
    if (now() - (existing.at ?? 0) < staleMs) {
      return { acquired: false, heldBy: existing.owner, since: existing.at }
    }
    await rm(lockFile, { force: true }) // verrou abandonné
    await tryCreate()
  }
  return {
    acquired: true,
    async release() {
      await rm(lockFile, { force: true })
    },
  }
}

/**
 * Ajoute des lignes JSONL sans doublon (clé = valeur renvoyée par keyOf).
 * Renvoie le nouveau contenu et le nombre de lignes réellement ajoutées.
 */
export function mergeJsonl(existingText, newRecords, keyOf) {
  const lines = (existingText ?? '').split('\n').filter(Boolean)
  const seen = new Set()
  for (const line of lines) {
    try {
      seen.add(keyOf(JSON.parse(line)))
    } catch {
      // ligne illisible : conservée telle quelle, jamais supprimée
    }
  }
  let added = 0
  for (const rec of newRecords) {
    const key = keyOf(rec)
    if (seen.has(key)) continue
    seen.add(key)
    lines.push(JSON.stringify(rec))
    added += 1
  }
  return { text: lines.length ? `${lines.join('\n')}\n` : '', added }
}
