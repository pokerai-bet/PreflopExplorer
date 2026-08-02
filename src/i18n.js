const LOCALES = [
  { code: 'en', lang: 'en', prefix: '', label: 'EN', dashboardLang: 'en' },
  { code: 'zh', lang: 'zh-Hans', prefix: '/zh', label: '中文', dashboardLang: 'zh-Hans' },
  { code: 'es', lang: 'es', prefix: '/es', label: 'ES', dashboardLang: 'es' },
  { code: 'pt-BR', lang: 'pt-BR', prefix: '/pt-br', label: 'PT-BR', dashboardLang: 'pt-BR' },
  { code: 'ja', lang: 'ja', prefix: '/ja', label: '日本語', dashboardLang: 'ja' },
]

const MESSAGES = {
  en: {
    docs: 'Docs', reference: 'Reference', ranges: 'Ranges', guides: 'Guides', showcases: 'Showcases', pricing: 'Pricing',
    signIn: 'Sign in', dashboard: 'Dashboard', switchLanguage: 'Switch language',
    eyebrow: 'Study tool · Presolved strategy', heroCopy: 'Browse the 6-max mixed-strategy action tree from the existing Pokerai Preflop library.',
    accountRequired: 'Pokerai account required', lockedTitle: 'Sign in to view strategies', lockedCopy: 'The first load of each strategy node uses 1 of your own presolved quota. The same node is cached for this session.', loginPokerai: 'Sign in to Pokerai',
    version: 'Version', versionAria: 'Preflop chart version', reset: '↺ Reset action line', resetTitle: 'Return to the UTG opening node', autoLoad: 'Select a version to load automatically',
    resources: 'Resources', developers: 'Developers', support: 'Support', legal: 'Legal', tagline: 'Solver-grade GTO strategy over HTTP.',
    faq: 'FAQ', changelog: 'Changelog', contact: 'Contact', terms: 'Terms', privacy: 'Privacy',
    preflopNoData: 'No Preflop data is available', loadFailed: 'Load failed', preflopNodeMissing: 'Action node not found',
    viewStepTitle: 'Return to before this action', viewStrategyTitle: (seat) => `View ${seat} strategy`, clickActionTitle: 'Choose this action',
    actionLineFinished: 'Action line complete', actionLineTerminal: 'The action line is complete', toActNoStrategy: (seat) => `${seat} to act; no strategy at this node`,
    chooseActionHint: 'Choose an action to continue', strategyNotFound: 'Strategy not found for this node', strategyLoadFailed: 'Strategy failed to load',
    firstLoadQuota: 'The first load of this node uses 1 presolved quota', quotaExceeded: 'Presolved quota is exhausted', rateLimited: 'Too many requests. Try again shortly.',
    priorStrategyHeading: (seat, action, raise, call, fold) => `${seat} · ${action} (Raise ${raise}% / Call ${call}% / Fold ${fold}%)`,
    heroStrategyHeading: (seat) => `${seat} strategy`, preciseStrategyHint: (side, seat) => `Select a hand in the ${side} range for exact ${seat} frequencies`,
    leftSide: 'left', rightSide: 'right', handsCount: (count, actions) => `${count} hands · ${actions}`,
    terminalActionTitle: 'This action has no deeper node; select it to view the matching range', noPreflopStrategy: 'No strategy is available', comboStrategyCaption: (count) => `${count} combos · r=raise c=call`,
    quota: (used, limit) => `Presolved ${used} / ${limit}`,
  },
  zh: {
    docs: '文档', reference: '参考', ranges: '范围', guides: '教程', showcases: '案例展示', pricing: '定价',
    signIn: '登录', dashboard: '控制台', switchLanguage: '切换语言',
    eyebrow: '学习工具 · 预解策略', heroCopy: '沿现有 Pokerai Preflop 库的行动树浏览 6-max 混合策略。',
    accountRequired: '需要 Pokerai 账户', lockedTitle: '登录后查看策略', lockedCopy: '每个首次打开的策略节点消耗 1 次你自己的 presolved quota；相同节点会在本次会话中缓存。', loginPokerai: '登录 Pokerai',
    version: '版本', versionAria: 'Preflop 图表版本', reset: '↺ 重置行动线', resetTitle: '回到 UTG 首入节点', autoLoad: '选择版本后自动加载',
    resources: '资源', developers: '开发者', support: '支持', legal: '法律', tagline: '通过 HTTP 获取 Solver 级 GTO 策略。',
    faq: '常见问题', changelog: '更新日志', contact: '联系', terms: '条款', privacy: '隐私',
    preflopNoData: '没有可用的 Preflop 数据', loadFailed: '加载失败', preflopNodeMissing: '行动节点不存在',
    viewStepTitle: '回到此行动之前', viewStrategyTitle: (seat) => `查看 ${seat} 的策略`, clickActionTitle: '选择此行动',
    actionLineFinished: '行动线结束', actionLineTerminal: '行动线已结束', toActNoStrategy: (seat) => `${seat} 行动，当前节点没有策略`,
    chooseActionHint: '选择一个行动继续', strategyNotFound: '未找到该节点策略', strategyLoadFailed: '策略加载失败',
    firstLoadQuota: '首次加载此节点会消耗 1 次 presolved quota', quotaExceeded: 'Presolved quota 已用完', rateLimited: '请求过于频繁，请稍后再试。',
    priorStrategyHeading: (seat, action, raise, call, fold) => `${seat} · ${action}（Raise ${raise}% / Call ${call}% / Fold ${fold}%）`,
    heroStrategyHeading: (seat) => `${seat} 策略`, preciseStrategyHint: (side, seat) => `点击${side}范围中的手牌查看 ${seat} 精确频率`,
    leftSide: '左侧', rightSide: '右侧', handsCount: (count, actions) => `${count} hands · ${actions}`,
    terminalActionTitle: '该行动没有更深节点；点击查看对应范围', noPreflopStrategy: '没有可用策略', comboStrategyCaption: (count) => `${count} combos · r=raise c=call`,
    quota: (used, limit) => `预解配额 ${used} / ${limit}`,
  },
  es: {
    docs: 'Documentación', reference: 'Referencia', ranges: 'Rangos', guides: 'Guías', showcases: 'Casos de uso', pricing: 'Precios',
    signIn: 'Iniciar sesión', dashboard: 'Panel de control', switchLanguage: 'Cambiar idioma',
    eyebrow: 'Herramienta de estudio · Estrategia precalculada', heroCopy: 'Explora el árbol de acciones de estrategia mixta 6-max de la biblioteca Preflop de Pokerai.',
    accountRequired: 'Se requiere una cuenta de Pokerai', lockedTitle: 'Inicia sesión para ver estrategias', lockedCopy: 'La primera carga de cada nodo usa 1 unidad de tu cuota precalculada. El mismo nodo queda en caché durante esta sesión.', loginPokerai: 'Iniciar sesión en Pokerai',
    version: 'Versión', versionAria: 'Versión del gráfico preflop', reset: '↺ Reiniciar línea de acción', resetTitle: 'Volver al nodo de apertura UTG', autoLoad: 'Selecciona una versión para cargarla',
    resources: 'Recursos', developers: 'Desarrolladores', support: 'Soporte', legal: 'Legal', tagline: 'Estrategia GTO de nivel solver por HTTP.', faq: 'Preguntas frecuentes', changelog: 'Cambios', contact: 'Contacto', terms: 'Términos', privacy: 'Privacidad',
    preflopNoData: 'No hay datos Preflop disponibles', loadFailed: 'Error de carga', preflopNodeMissing: 'No se encontró el nodo de acción', viewStepTitle: 'Volver antes de esta acción', viewStrategyTitle: (seat) => `Ver la estrategia de ${seat}`, clickActionTitle: 'Elegir esta acción', actionLineFinished: 'Línea de acción completa', actionLineTerminal: 'La línea de acción ha terminado', toActNoStrategy: (seat) => `${seat} actúa; no hay estrategia en este nodo`, chooseActionHint: 'Elige una acción para continuar', strategyNotFound: 'No se encontró estrategia para este nodo', strategyLoadFailed: 'No se pudo cargar la estrategia', firstLoadQuota: 'La primera carga de este nodo usa 1 unidad de cuota precalculada', quotaExceeded: 'La cuota precalculada se ha agotado', rateLimited: 'Demasiadas solicitudes. Inténtalo de nuevo en breve.', priorStrategyHeading: (seat, action, raise, call, fold) => `${seat} · ${action} (Raise ${raise}% / Call ${call}% / Fold ${fold}%)`, heroStrategyHeading: (seat) => `Estrategia de ${seat}`, preciseStrategyHint: (side, seat) => `Selecciona una mano en el rango ${side} para ver las frecuencias exactas de ${seat}`, leftSide: 'izquierdo', rightSide: 'derecho', handsCount: (count, actions) => `${count} manos · ${actions}`, terminalActionTitle: 'Esta acción no tiene un nodo posterior; selecciónala para ver el rango', noPreflopStrategy: 'No hay estrategia disponible', comboStrategyCaption: (count) => `${count} combos · r=raise c=call`, quota: (used, limit) => `Precalculadas ${used} / ${limit}`,
  },
  'pt-BR': {
    docs: 'Documentação', reference: 'Referência', ranges: 'Ranges', guides: 'Guias', showcases: 'Casos', pricing: 'Preços', signIn: 'Entrar', dashboard: 'Painel', switchLanguage: 'Mudar idioma',
    eyebrow: 'Ferramenta de estudo · Estratégia pré-resolvida', heroCopy: 'Explore a árvore de ações de estratégia mista 6-max da biblioteca Preflop da Pokerai.', accountRequired: 'É necessária uma conta Pokerai', lockedTitle: 'Entre para ver as estratégias', lockedCopy: 'O primeiro carregamento de cada nó usa 1 unidade da sua cota pré-resolvida. O mesmo nó fica em cache nesta sessão.', loginPokerai: 'Entrar na Pokerai', version: 'Versão', versionAria: 'Versão do gráfico preflop', reset: '↺ Redefinir linha de ação', resetTitle: 'Voltar ao nó de abertura UTG', autoLoad: 'Selecione uma versão para carregar', resources: 'Recursos', developers: 'Desenvolvedores', support: 'Suporte', legal: 'Legal', tagline: 'Estratégia GTO de nível solver via HTTP.', faq: 'FAQ', changelog: 'Alterações', contact: 'Contato', terms: 'Termos', privacy: 'Privacidade',
    preflopNoData: 'Não há dados Preflop disponíveis', loadFailed: 'Falha ao carregar', preflopNodeMissing: 'Nó de ação não encontrado', viewStepTitle: 'Voltar para antes desta ação', viewStrategyTitle: (seat) => `Ver estratégia de ${seat}`, clickActionTitle: 'Escolher esta ação', actionLineFinished: 'Linha de ação concluída', actionLineTerminal: 'A linha de ação terminou', toActNoStrategy: (seat) => `${seat} age; não há estratégia neste nó`, chooseActionHint: 'Escolha uma ação para continuar', strategyNotFound: 'Estratégia não encontrada para este nó', strategyLoadFailed: 'Falha ao carregar a estratégia', firstLoadQuota: 'O primeiro carregamento deste nó usa 1 unidade da cota pré-resolvida', quotaExceeded: 'A cota pré-resolvida acabou', rateLimited: 'Muitas solicitações. Tente novamente em instantes.', priorStrategyHeading: (seat, action, raise, call, fold) => `${seat} · ${action} (Raise ${raise}% / Call ${call}% / Fold ${fold}%)`, heroStrategyHeading: (seat) => `Estratégia de ${seat}`, preciseStrategyHint: (side, seat) => `Selecione uma mão no range ${side} para ver as frequências exatas de ${seat}`, leftSide: 'esquerdo', rightSide: 'direito', handsCount: (count, actions) => `${count} mãos · ${actions}`, terminalActionTitle: 'Esta ação não tem um nó posterior; selecione-a para ver o range', noPreflopStrategy: 'Nenhuma estratégia disponível', comboStrategyCaption: (count) => `${count} combos · r=raise c=call`, quota: (used, limit) => `Pré-resolvidas ${used} / ${limit}`,
  },
  ja: {
    docs: 'ドキュメント', reference: 'リファレンス', ranges: 'レンジ', guides: 'ガイド', showcases: '活用事例', pricing: '料金', signIn: 'ログイン', dashboard: 'ダッシュボード', switchLanguage: '言語を切り替える',
    eyebrow: '学習ツール · 事前計算済み戦略', heroCopy: '既存の Pokerai Preflop ライブラリから 6-max 混合戦略のアクションツリーを閲覧できます。', accountRequired: 'Pokerai アカウントが必要です', lockedTitle: 'ログインして戦略を表示', lockedCopy: '各戦略ノードの初回読み込みで、ご自身の事前計算済みクォータを 1 回使用します。同じノードはこのセッション中キャッシュされます。', loginPokerai: 'Pokerai にログイン', version: 'バージョン', versionAria: 'Preflop チャートのバージョン', reset: '↺ アクションラインをリセット', resetTitle: 'UTG オープンノードに戻る', autoLoad: 'バージョンを選択すると読み込みます', resources: 'リソース', developers: '開発者', support: 'サポート', legal: '法務', tagline: 'Solver 品質の GTO 戦略を HTTP で。', faq: 'FAQ', changelog: '変更履歴', contact: 'お問い合わせ', terms: '利用規約', privacy: 'プライバシー',
    preflopNoData: '利用可能な Preflop データがありません', loadFailed: '読み込みに失敗しました', preflopNodeMissing: 'アクションノードが見つかりません', viewStepTitle: 'このアクションの前に戻る', viewStrategyTitle: (seat) => `${seat} の戦略を表示`, clickActionTitle: 'このアクションを選択', actionLineFinished: 'アクションライン完了', actionLineTerminal: 'アクションラインは終了しました', toActNoStrategy: (seat) => `${seat} のアクションです。このノードに戦略はありません`, chooseActionHint: '続行するアクションを選択', strategyNotFound: 'このノードの戦略が見つかりません', strategyLoadFailed: '戦略の読み込みに失敗しました', firstLoadQuota: 'このノードの初回読み込みで事前計算済みクォータを 1 回使用します', quotaExceeded: '事前計算済みクォータを使い切りました', rateLimited: 'リクエストが多すぎます。しばらくしてから再試行してください。', priorStrategyHeading: (seat, action, raise, call, fold) => `${seat} · ${action} (Raise ${raise}% / Call ${call}% / Fold ${fold}%)`, heroStrategyHeading: (seat) => `${seat} の戦略`, preciseStrategyHint: (side, seat) => `${side}レンジのハンドを選択して ${seat} の正確な頻度を表示`, leftSide: '左', rightSide: '右', handsCount: (count, actions) => `${count} ハンド · ${actions}`, terminalActionTitle: 'このアクションには次のノードがありません。選択して対応レンジを表示', noPreflopStrategy: '利用可能な戦略がありません', comboStrategyCaption: (count) => `${count} コンボ · r=raise c=call`, quota: (used, limit) => `事前計算済み ${used} / ${limit}`,
  },
}

export function localeFromPath(pathname = '/') {
  return LOCALES.find((locale) => locale.prefix && (pathname === locale.prefix || pathname.startsWith(`${locale.prefix}/`))) || LOCALES[0]
}

export function translate(localeCode, key, ...args) {
  const value = (MESSAGES[localeCode] || MESSAGES.en)[key] ?? MESSAGES.en[key] ?? key
  return typeof value === 'function' ? value(...args) : value
}

export const currentLocale = localeFromPath(globalThis.location?.pathname || '/')
export const tr = (key, ...args) => translate(currentLocale.code, key, ...args)

export function productUrl(path, locale = currentLocale) {
  return `https://pokerai.bet${locale.prefix}${path === '/' ? '/' : path}`
}

export function applyPageI18n() {
  document.documentElement.lang = currentLocale.lang
  document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = tr(element.dataset.i18n) })
  document.querySelectorAll('[data-product-path]').forEach((link) => { link.href = productUrl(link.dataset.productPath) })

  const languageButton = document.getElementById('lang')
  const languageMenu = document.getElementById('language-menu')
  if (languageButton && languageMenu) {
    languageButton.title = tr('switchLanguage')
    languageButton.setAttribute('aria-label', tr('switchLanguage'))
    languageMenu.setAttribute('aria-label', tr('switchLanguage'))
    const label = languageButton.querySelector('[data-lang-label]')
    if (label) label.textContent = currentLocale.label
    languageMenu.querySelectorAll('[data-language-target]').forEach((link) => {
      const target = LOCALES.find((locale) => locale.code === link.dataset.languageTarget)
      if (!target) return
      link.href = productUrl('/preflop-explorer/', target)
      if (target === currentLocale) {
        link.setAttribute('aria-current', 'page')
        link.style.color = 'var(--text)'
      } else {
        link.removeAttribute('aria-current')
        link.style.color = 'var(--muted)'
      }
    })
    languageButton.onclick = () => {
      const open = languageMenu.hidden
      languageMenu.hidden = !open
      languageButton.setAttribute('aria-expanded', open ? 'true' : 'false')
    }
    document.addEventListener('click', (event) => {
      if (!languageMenu.hidden && !languageMenu.contains(event.target) && !languageButton.contains(event.target)) {
        languageMenu.hidden = true
        languageButton.setAttribute('aria-expanded', 'false')
      }
    })
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !languageMenu.hidden) {
        languageMenu.hidden = true
        languageButton.setAttribute('aria-expanded', 'false')
        languageButton.focus()
      }
    })
  }

  const version = document.getElementById('pfv')
  if (version) { version.title = tr('version'); version.setAttribute('aria-label', tr('versionAria')) }
  const reset = document.getElementById('pfreset')
  if (reset) reset.title = tr('resetTitle')
}
