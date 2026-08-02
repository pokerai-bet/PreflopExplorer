import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { handAt, pfAggOf, pfComboLabel } from './main.js'

describe('application shell', () => {
  it('loads the explorer stylesheet', () => {
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
    expect(html).toContain('href="/src/styles.css"')
  })

  it('matches the Pokerai product shell without adding a global Explorer link', () => {
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
    const navigation = html.match(/<nav[\s\S]*?<\/nav>/)?.[0] || ''

    expect(navigation).toContain('class="site-nav"')
    expect(navigation).toContain('href="https://pokerai.bet/ranges"')
    expect(navigation).toContain('href="https://pokerai.bet/showcases"')
    expect(navigation).toContain('aria-current="page"')
    expect(navigation).not.toContain('/preflop-explorer/')
    expect(html).toContain('class="site-footer"')
  })

  it('keeps every DOM hook required by the Luna explorer port', () => {
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')

    for (const id of ['locked', 'explorer', 'pfv', 'pfreset', 'pfcount', 'preflop-body', 'pfquota', 'account-link', 'toast']) {
      expect(html).toContain(`id="${id}"`)
    }
  })
})

describe('ported Luna preflop helpers', () => {
  it('keeps the upstream 13x13 hand ordering', () => {
    expect(handAt(0, 0)).toBe('AA')
    expect(handAt(0, 1)).toBe('AKs')
    expect(handAt(1, 0)).toBe('AKo')
  })

  it('keeps upstream combo aggregation semantics', () => {
    expect(pfComboLabel('ADKD')).toBe('AKs')
    expect(pfComboLabel('ADKH')).toBe('AKo')
    expect(pfComboLabel('ADAH')).toBe('AA')
  })

  it('weights the aggregate by combo count', () => {
    expect(pfAggOf({ AA: { raise: 1, call: 0, combos: 6 } }, false)).toEqual({ raise: 1, call: 0, fold: 0 })
  })
})
