// @vitest-environment node
// Vérifie la CONFIGURATION des déclencheurs (heure de Paris, été/hiver,
// redondance, concurrence) et la logique d'alerte / chien de garde. Ces tests
// valident le contenu des fichiers de workflow ; ils ne peuvent pas prouver
// que GitHub déclenchera l'exécution à l'heure (voir docs/AGENT.md).
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import YAML from 'yaml'
import { buildAlert } from '../alert.mjs'
import { activeAgentRuns, ensureLabel, openIssueOnce } from '../lib/github.mjs'
import { parisHm, parisToUtc, parisYmd } from '../lib/time.mjs'
import { evaluateWatchdog } from '../watchdog.mjs'
import { REAL_ROOT } from './helpers.mjs'

const load = async (name) => {
  const text = await readFile(path.join(REAL_ROOT, '.github/workflows', name), 'utf8')
  return { text, doc: YAML.parse(text) }
}
// `on` est lu comme booléen `true` par certains analyseurs YAML 1.1 : on accepte les deux.
const triggers = (doc) => doc.on ?? doc[true]
const parseCron = (cron) => {
  const [m, h, dom, mon, dow] = cron.split(' ')
  return { minute: Number(m), hour: Number(h), simple: dom === '*' && mon === '*' && dow === '*' }
}

describe('workflow de l\'agent quotidien', () => {
  it('plusieurs déclencheurs redondants, tous en heure de Paris, avant 09:45', async () => {
    const { doc } = await load('daily-agent.yml')
    const schedule = triggers(doc).schedule
    expect(schedule.length).toBeGreaterThanOrEqual(3)
    for (const s of schedule) {
      expect(s.timezone).toBe('Europe/Paris')
      const c = parseCron(s.cron)
      expect(c.simple).toBe(true) // tous les jours de la semaine
      expect(c.hour * 60 + c.minute).toBeLessThan(9 * 60 + 45)
      expect(c.hour).toBeGreaterThanOrEqual(4)
      expect([0, 30]).not.toContain(c.minute) // minutes de pointe de GitHub évitées
    }
    const times = schedule.map((s) => parseCron(s.cron).hour * 60 + parseCron(s.cron).minute)
    expect(new Set(times).size).toBe(times.length)
  })

  it('l\'heure locale reste cohérente en été et en hiver (même heure de Paris, UTC différent)', async () => {
    const { doc } = await load('daily-agent.yml')
    for (const s of triggers(doc).schedule) {
      const c = parseCron(s.cron)
      const hm = `${String(c.hour).padStart(2, '0')}:${String(c.minute).padStart(2, '0')}`
      const summer = parisToUtc('2026-07-15', hm)
      const winter = parisToUtc('2026-01-15', hm)
      expect(parisHm(summer)).toBe(hm)
      expect(parisHm(winter)).toBe(hm)
      expect(summer.getUTCHours()).toBe(c.hour - 2)
      expect(winter.getUTCHours()).toBe(c.hour - 1)
      // jamais après l'échéance de travail (09:45 Paris) ni 10:00
      expect(summer.getTime()).toBeLessThan(parisToUtc('2026-07-15', '09:45').getTime())
      expect(winter.getTime()).toBeLessThan(parisToUtc('2026-01-15', '09:45').getTime())
    }
  })

  it('déclenchement manuel, déclencheur push externe, et jamais deux exécutions simultanées', async () => {
    const { doc } = await load('daily-agent.yml')
    const t = triggers(doc)
    expect(t.workflow_dispatch.inputs.dry_run.type).toBe('boolean')
    expect(t.push.paths).toEqual(['agent-data/trigger.txt'])
    expect(doc.concurrency).toEqual({ group: 'daily-agent', 'cancel-in-progress': false })
    expect(doc.jobs.agent['timeout-minutes']).toBeLessThanOrEqual(60)
  })

  it('valide (tests + build) AVANT de publier, et ne contient aucun secret en clair', async () => {
    const { doc, text } = await load('daily-agent.yml')
    const steps = doc.jobs.agent.steps
    const idx = (frag) => steps.findIndex((s) => (s.name ?? '').includes(frag))
    expect(idx('Valider')).toBeGreaterThan(idx('Agent'))
    expect(idx('Publier')).toBeGreaterThan(idx('Valider'))
    expect(text).toContain('secrets.EBAY_CLIENT_ID')
    expect(text).toContain('secrets.EBAY_CLIENT_SECRET')
    expect(text).not.toMatch(/(?:client_?secret|token|password)\s*[:=]\s*['"]?[A-Za-z0-9_-]{20,}/i)
    expect(text).not.toMatch(/PRD-|SBX-/) // forme des identifiants d'application eBay
  })

  it('permissions minimales', async () => {
    const { doc } = await load('daily-agent.yml')
    expect(doc.permissions).toEqual({ contents: 'write', issues: 'write' })
  })
})

describe('autres workflows', () => {
  it('l\'ancien pipeline n\'a plus de déclencheur planifié (un seul écrivain automatique)', async () => {
    const { doc } = await load('update-prices.yml')
    expect(triggers(doc).schedule).toBeUndefined()
    expect(triggers(doc).workflow_dispatch).toBeDefined()
    expect(Object.keys(doc.jobs)).toEqual(['update-prices']) // le rappel du lundi qui échouait est parti
  })

  it('le chien de garde passe après 10:00 Paris, en heure de Paris', async () => {
    const { doc } = await load('agent-watchdog.yml')
    for (const s of triggers(doc).schedule) {
      expect(s.timezone).toBe('Europe/Paris')
      const c = parseCron(s.cron)
      expect(c.hour * 60 + c.minute).toBeGreaterThan(10 * 60)
    }
    expect(doc.permissions).toMatchObject({ actions: 'write', issues: 'write' })
  })

  it('le routeur du jour est bien le jour parisien', () => {
    expect(parisYmd(new Date('2026-10-24T22:30:00Z'))).toBe('2026-10-25')
  })
})

describe('chien de garde', () => {
  const day = '2026-10-24'
  const at = (hm) => parisToUtc(day, hm)
  const report = (over = {}) => ({ status: 'termine', finishedBeforeTenParis: true, finishedParis: '2026-10-24 07:12 (Paris)', startedParis: '2026-10-24 07:05 (Paris)', counts: { unprocessed: 0 }, ...over })

  it('rien à faire avant 10 h', () => {
    expect(evaluateWatchdog({ now: at('09:00'), report: null, activeRuns: 0 })).toMatchObject({ level: 'tot', relaunch: false })
  })
  it('ok si terminé avant 10 h', () => {
    expect(evaluateWatchdog({ now: at('10:07'), report: report(), activeRuns: 0 })).toMatchObject({ level: 'ok', relaunch: false })
  })
  it('alerte (sans relance) si terminé mais après 10 h', () => {
    const v = evaluateWatchdog({ now: at('11:40'), report: report({ finishedBeforeTenParis: false }), activeRuns: 0 })
    expect(v).toMatchObject({ level: 'en-retard', relaunch: false })
    expect(v.title).toMatch(/APRÈS 10 h/)
  })
  it('aucun rapport à 10 h : alerte et relance', () => {
    expect(evaluateWatchdog({ now: at('10:07'), report: null, activeRuns: 0 })).toMatchObject({ level: 'absent', relaunch: true })
  })
  it('aucun rapport mais une exécution en cours : alerte sans doubler la relance', () => {
    expect(evaluateWatchdog({ now: at('10:07'), report: null, activeRuns: 1 })).toMatchObject({ level: 'absent', relaunch: false })
  })
  it('rapport partiel : alerte et reprise', () => {
    expect(evaluateWatchdog({ now: at('10:07'), report: report({ status: 'partiel' }), activeRuns: 0 })).toMatchObject({ level: 'partiel', relaunch: true })
  })
})

describe('alertes', () => {
  const day = '2026-10-24'
  it('aucune alerte quand tout est terminé à temps', () => {
    expect(buildAlert({ day, report: { status: 'termine', finishedBeforeTenParis: true } })).toBeNull()
    expect(buildAlert({ day, report: { status: 'termine_avec_avertissements', finishedBeforeTenParis: true } })).toBeNull()
  })
  it('alerte sur partiel, échec, dépassement et absence de rapport', () => {
    const base = { startedParis: 'a', finishedParis: 'b', counts: { unprocessed: 3 } }
    expect(buildAlert({ day, report: { ...base, status: 'partiel' } }).title).toMatch(/Partiel/)
    expect(buildAlert({ day, report: { ...base, status: 'echec', fatal: 'eBay refusé' } }).body).toMatch(/eBay refusé/)
    expect(buildAlert({ day, report: { status: 'termine', trigger: 'schedule', finishedBeforeTenParis: false, finishedParis: 'x' } }).title).toMatch(/APRÈS 10 h/)
    // un lancement manuel tardif n'est pas un incident
    expect(buildAlert({ day, report: { status: 'termine', trigger: 'workflow_dispatch', finishedBeforeTenParis: false, finishedParis: 'x' } })).toBeNull()
    expect(buildAlert({ day, report: null, agentOutcome: 'failure' }).title).toMatch(/sans rapport/)
    expect(buildAlert({ day, report: null, agentOutcome: 'success' })).toBeNull()
  })
})

describe('issues GitHub (cause de l\'échec du lundi corrigée)', () => {
  const fakeGh = (existingTitles = []) => {
    const calls = []
    const gh = async (args) => {
      calls.push(args)
      if (args[0] === 'issue' && args[1] === 'list') return JSON.stringify(existingTitles.map((title) => ({ title })))
      if (args[0] === 'run') return JSON.stringify([{ databaseId: 1 }])
      return ''
    }
    return { gh, calls }
  }

  it('crée le libellé AVANT l\'issue (le libellé manquant faisait échouer le rappel)', async () => {
    const { gh, calls } = fakeGh()
    await openIssueOnce(gh, { title: 'T', body: 'B', label: 'price-review' })
    const order = calls.map((c) => c.slice(0, 2).join(' '))
    expect(order.indexOf('label create')).toBeLessThan(order.indexOf('issue create'))
  })

  it('un libellé déjà existant n\'empêche rien', async () => {
    const calls = []
    const gh = async (args) => {
      calls.push(args)
      if (args[0] === 'label') throw new Error('already exists')
      return args[1] === 'list' ? '[]' : ''
    }
    expect(await openIssueOnce(gh, { title: 'T', body: 'B', label: 'x' })).toEqual({ created: true })
  })

  it('ne crée pas deux fois la même issue', async () => {
    const { gh, calls } = fakeGh(['T'])
    expect(await openIssueOnce(gh, { title: 'T', body: 'B', label: 'x' })).toEqual({ created: false })
    expect(calls.some((c) => c[0] === 'issue' && c[1] === 'create')).toBe(false)
  })

  it('compte les exécutions actives (en cours + en file)', async () => {
    const { gh } = fakeGh()
    expect(await activeAgentRuns(gh)).toBe(2)
    await expect(ensureLabel(async () => { throw new Error('x') }, 'a', 'fff', 'd')).resolves.toBeUndefined()
  })
})
