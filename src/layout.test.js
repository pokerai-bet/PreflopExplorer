import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('range workspace layout', () => {
  it('keeps a single strategy grid in the same two-column track used by comparisons', () => {
    const source = readFileSync(new URL('./main.js', import.meta.url), 'utf8')
    const styles = readFileSync(new URL('./styles.css', import.meta.url), 'utf8')

    expect(source).toContain('class="range-slot-empty"')
    expect(source).toContain('<div class="ranges2">')
    expect(styles).toContain('.ranges2 { display: grid; gap: 18px; grid-template-columns: 1fr 1fr; }')
    expect(styles).toContain('.range-slot-empty { display: none; }')
  })
})
