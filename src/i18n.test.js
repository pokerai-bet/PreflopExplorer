import { describe, expect, it } from 'vitest'
import { localeFromPath, productUrl, translate } from './i18n.js'

describe('product-site locale routing', () => {
  it.each([
    ['/', 'en'],
    ['/preflop-explorer/', 'en'],
    ['/zh/preflop-explorer/', 'zh'],
    ['/es/preflop-explorer/', 'es'],
    ['/pt-br/preflop-explorer/', 'pt-BR'],
    ['/ja/preflop-explorer/', 'ja'],
  ])('maps %s to %s', (path, code) => {
    expect(localeFromPath(path).code).toBe(code)
  })

  it('keeps product navigation inside the active locale', () => {
    const locale = localeFromPath('/zh/preflop-explorer/')
    expect(productUrl('/ranges', locale)).toBe('https://pokerai.bet/zh/ranges')
  })

  it.each(['zh', 'es', 'pt-BR', 'ja'])('ships localized Explorer copy for %s', (locale) => {
    expect(translate(locale, 'heroCopy')).not.toBe(translate('en', 'heroCopy'))
    expect(translate(locale, 'signIn')).not.toBe(translate('en', 'signIn'))
    expect(translate(locale, 'quota', 6, 20000)).not.toBe(translate('en', 'quota', 6, 20000))
  })
})
