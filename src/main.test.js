import { describe, expect, it } from 'vitest'
import { handAt, pfAggOf, pfComboLabel } from './main.js'

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
