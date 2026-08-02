import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { handAt, pfAggOf, pfComboLabel } from './main.js'

describe('application shell', () => {
  it('loads the explorer stylesheet', () => {
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
    expect(html).toContain('href="/src/styles.css"')
  })

  it('uses the Pokerai product navigation without adding a global Explorer item', () => {
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
    const navigation = html.match(/<nav[\s\S]*?<\/nav>/)?.[0] || ''
    const globalLinks = navigation.match(/<div class="nl"[\s\S]*?<\/div>/)?.[0] || ''

    expect(navigation).toContain('class="nl"')
    expect(globalLinks).toContain('href="https://pokerai.bet/ranges"')
    expect(globalLinks).toContain('href="https://pokerai.bet/showcases"')
    expect(globalLinks).not.toContain('Preflop Explorer')
    expect(navigation).toContain('id="language-menu"')
    expect(navigation).not.toContain('id="pfquota"')
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
