/*
 * Preflop browser ported from gv-gto-auth/web/admin.html at
 * 7cee19010233816cca368423a17719dfa168f38c (preflop block beginning at line 3785).
 * Business behavior is kept intact. Explorer-specific changes are limited to user-JWT auth,
 * endpoint routing, removal of the out-of-scope flop handoff, and presentation.
 */

import { applyPageI18n, currentLocale, tr } from './i18n.js'

const $ = (id) => document.getElementById(id)
const API_BASE = (import.meta.env.VITE_POKERAI_API_BASE_URL || 'https://pokerai.bet').replace(/\/$/, '')
const LOGIN_URL = `${API_BASE}/login`
const TOKEN_KEY = 'gto_token'
const ENDPOINTS = {
  '/auth/admin/preflop/meta': '/v1/apps/preflop-explorer/meta',
  '/auth/admin/preflop/tree': '/v1/apps/preflop-explorer/tree',
  '/auth/admin/preflop/strategy': '/v1/apps/preflop-explorer/strategy',
}

function token() {
  try { return localStorage.getItem(TOKEN_KEY) || '' } catch { return '' }
}

function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem('gto_email') } catch { /* storage unavailable */ }
}

async function api(path, options = {}) {
  const jwt = token()
  if (!jwt) throw new Error('authentication_required')
  const response = await fetch(API_BASE + (ENDPOINTS[path] || path), {
    ...options,
    headers: { ...options.headers, authorization: `Bearer ${jwt}` },
  })
  if (response.status === 401) {
    clearToken()
    showLocked()
  }
  return response
}

let toastT
function toast(message) {
  const el = $('toast')
  el.textContent = message
  el.classList.add('on')
  clearTimeout(toastT)
  toastT = setTimeout(() => el.classList.remove('on'), 2200)
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character])
}

function adminRaw(message, detail) {
  console.error(message, detail)
}

function setQuota(quota) {
  if (!quota || !Number.isFinite(Number(quota.used)) || !Number.isFinite(Number(quota.limit))) return
  $('pfquota').textContent = tr('quota', quota.used, quota.limit)
}

function showLocked() {
  $('locked').classList.remove('hide')
  $('explorer').classList.add('hide')
  $('account-link').textContent = tr('signIn')
  $('account-link').href = LOGIN_URL
}

function showExplorer() {
  $('locked').classList.add('hide')
  $('explorer').classList.remove('hide')
  $('account-link').textContent = tr('dashboard')
  $('account-link').href = `${API_BASE}/dashboard?lang=${encodeURIComponent(currentLocale.dashboardLang)}`
}

/* ---------- preflop DB (browse, read-only): upstream business logic ---------- */
let pfTree = null, pfPath = '', pfVer = '', pfCur = null, pfCurL = null, pfReq = 0, pfRangeSel = null, pfTermBk = null, pfCallMap = {}
const PF_ACTS = ['raise', 'call', 'fold']
const PF_COL = { raise: '#e1452f', call: '#2fa968', fold: '#3f78d0' }
const PF_RANKORD = { A: 0, K: 1, Q: 2, J: 3, T: 4, '9': 5, '8': 6, '7': 7, '6': 8, '5': 9, '4': 10, '3': 11, '2': 12 }
const PF_ACTLBL = { Fold: 'Fold', Call: 'Call', Raise: 'Raise', '3-Bet': '3bet', '4-Bet': '4bet', '5-Bet': '5bet', AllIn: 'All-in' }
const PF_SITLBL = { 'No Raise': 'RFI', Raise: 'Facing open', '3-Bet': 'Facing 3bet', '4-Bet': 'Facing 4bet', '5-Bet': 'Facing 5bet' }
const SUITSYM = { s: '♠', h: '♥', d: '♦', c: '♣' }
const SUITCOL = { s: '#d6dfdc', h: '#ef5d55', d: '#5c95ec', c: '#47d7a3' }
const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']

function pfActLabel(action) { return PF_ACTLBL[action] || action }
function pfSitLabel(situation) { return PF_SITLBL[situation] || situation }
function pfApi(path, body) { return api(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }) }

// Upstream behavior: static strategies are cached by exact decision identity for the session.
const pfStratCache = {}
async function pfStrat(version, position, situation, context) {
  const key = version + '|' + position + '|' + situation + '|' + (context || '')
  if (pfStratCache[key]) return pfStratCache[key]
  const response = await pfApi('/auth/admin/preflop/strategy', { version, position, situation, context: context || '' })
  let result
  try { result = await response.json() } catch (error) { adminRaw('preflop strategy parse exception', error); result = { status: 'error' } }
  setQuota(result && result.quota)
  if (response.status === 429) {
    setQuota({ used: result.used, limit: result.limit })
    toast(result.error === 'quota_exceeded' ? tr('quotaExceeded') : tr('rateLimited'))
  }
  if (result && result.status === 'success') pfStratCache[key] = result
  return result
}

async function loadPreflopMeta() {
  try {
    const response = await pfApi('/auth/admin/preflop/meta', {})
    const data = await response.json()
    const versions = data.versions || []
    setQuota(data.quota)
    if (!versions.length) { $('preflop-body').innerHTML = `<div class="empty">${tr('preflopNoData')}</div>`; return }
    $('pfv').innerHTML = versions.map((version) => `<option value="${esc(version)}">${esc(version)}</option>`).join('')
    await pfLoadVersion(versions[0])
  } catch (error) {
    adminRaw('preflop meta exception', error)
    $('preflop-body').innerHTML = `<div class="empty">${tr('loadFailed')}</div>`
  }
}

async function pfLoadVersion(version) {
  const mine = ++pfReq
  pfVer = version; pfPath = ''; pfTree = null; pfRangeSel = null; pfCallMap = {}
  $('preflop-body').innerHTML = '<div class="empty"><span class="spin"></span></div>'
  try {
    const response = await pfApi('/auth/admin/preflop/tree', { version })
    const data = await response.json()
    if (mine !== pfReq) return
    if (data.status !== 'success' || !data.nodes) {
      adminRaw('preflop tree failure', data)
      $('preflop-body').innerHTML = `<div class="empty">${tr('loadFailed')}</div>`
      return
    }
    pfTree = data.nodes; pfPath = data.root || ''; pfRender()
  } catch (error) {
    if (mine === pfReq) { adminRaw('preflop tree exception', error); $('preflop-body').innerHTML = `<div class="empty">${tr('loadFailed')}</div>` }
  }
}

function pfColnav(node, selectedIndex) {
  const tokens = pfPath ? pfPath.split(',') : []
  let columns = ''
  tokens.forEach((tokenValue, index) => {
    const segment = tokenValue.split(':'), action = pfCallMap[index] || segment[1]
    const css = action === 'Fold' ? 'pffold' : (action === 'Call' ? 'pfcall' : 'pfaggr')
    const viewing = index === selectedIndex ? ' pfviewing' : ''
    columns += `<div class="col${viewing}"><h5 class="pfrew" data-i="${index}" title="${tr('viewStepTitle')}">${esc(segment[0])} ✎</h5><div class="act sel pfview ${css}" data-i="${index}" title="${esc(tr('viewStrategyTitle', segment[0]))}"><span class="albl">${esc(pfActLabel(action))}</span></div></div>`
  })
  if (node.toAct) {
    const actions = Object.keys(node.acts || {})
    const base = actions.length ? actions.map((action) => `<div class="act pfact" data-act="${esc(action)}" title="${tr('clickActionTitle')}"><span class="albl">${esc(pfActLabel(action))}</span></div>`).join('') : `<div class="cmeta">${tr('actionLineFinished')}</div>`
    columns += `<div class="col active"><h5>${esc(node.toAct)} ⭐</h5><div id="pfacts">${base}</div></div>`
  }
  return `<div class="colnav">${columns}</div>`
}

function pfSelIdx() {
  const tokens = pfPath ? pfPath.split(',') : []
  if (pfRangeSel != null && pfRangeSel >= 0 && pfRangeSel < tokens.length) return pfRangeSel
  for (let index = tokens.length - 1; index >= 0; index--) if (tokens[index].split(':')[1] !== 'Fold') return index
  return -1
}

function pfRender() {
  const mine = ++pfReq
  const node = pfTree && pfTree[pfPath], wrap = $('preflop-body')
  if (!node) { wrap.innerHTML = `<div class="empty">${tr('preflopNodeMissing')}</div>`; return }
  const decision = node.decision, selectedIndex = pfSelIdx()
  const head = decision ? `<div class="nodemeta">${esc(decision.hero)} · ${esc(pfSitLabel(decision.situation))}</div>`
    : (node.toAct ? `<div class="nodemeta">${esc(tr('toActNoStrategy', node.toAct))}</div>` : `<div class="nodemeta">${tr('actionLineTerminal')}</div>`)
  const strategy = decision ? `<div class="empty"><span class="spin"></span><small>${esc(tr('firstLoadQuota'))}</small></div>`
    : (node.toAct ? `<div class="sub">${tr('chooseActionHint')}</div>` : `<div class="sub">${tr('actionLineFinished')}</div>`)
  wrap.innerHTML = pfColnav(node, selectedIndex) + head + '<div id="pfstrat">' + strategy + '</div>'
  wrap.querySelectorAll('.pfrew').forEach((button) => { button.onclick = () => {
    const index = +button.dataset.i
    pfPath = pfPath.split(',').slice(0, index).join(',')
    Object.keys(pfCallMap).forEach((key) => { if (+key >= index) delete pfCallMap[key] })
    pfRangeSel = null; pfRender()
  } })
  wrap.querySelectorAll('.pfview').forEach((button) => { button.onclick = () => { pfRangeSel = +button.dataset.i; pfRender() } })
  wrap.querySelectorAll('.pfact').forEach((button) => { button.onclick = () => {
    const nextPath = node.acts[button.dataset.act]
    if (nextPath != null) { pfPath = nextPath; pfRangeSel = null; pfRender() }
  } })
  if (!decision) { $('pfcount').textContent = ''; return }
  pfLoadStrat(decision, mine, selectedIndex)
}

function pfActedInPath(seat, pathValue) {
  return (pathValue ? pathValue.split(',') : []).some((tokenValue) => { const segment = tokenValue.split(':'); return segment[0] === seat && segment[1] !== 'Fold' })
}

export function pfAggOf(grid, full) {
  let raise = 0, call = 0, count = 0
  for (const key in grid) { const value = grid[key], combos = value.combos || 1; raise += value.raise * combos; call += value.call * combos; count += combos }
  const denominator = full ? 1326 : (count || 1), raiseFrequency = raise / denominator, callFrequency = call / denominator
  return { raise: raiseFrequency, call: callFrequency, fold: Math.max(0, 1 - raiseFrequency - callFrequency) }
}

function pfActsHtml(node, aggregate) {
  const actions = node.acts || {}
  const raiseKey = ['3-Bet', '4-Bet', '5-Bet', 'Raise', 'AllIn'].find((key) => actions[key] != null) || null
  const rows = [['raise', raiseKey, raiseKey ? pfActLabel(raiseKey) : pfActLabel('Raise')], ['call', actions.Call != null ? 'Call' : null, pfActLabel('Call')], ['fold', actions.Fold != null ? 'Fold' : null, pfActLabel('Fold')]]
  let html = ''
  const tokens = { raise: 'Raise', call: 'Call', fold: 'Fold' }
  rows.forEach((row) => {
    const bucket = row[0], navigationKey = row[1], label = row[2], frequency = aggregate[bucket] || 0
    if (frequency <= 0.0005 && !navigationKey) return
    const inner = `<span class="afill" style="width:${Math.max(3, frequency * 100).toFixed(0)}%;background:${PF_COL[bucket]}"></span><span class="albl">${esc(label)} ${(frequency * 100).toFixed(0)}%</span>`
    html += navigationKey ? `<div class="act pfact" data-act="${esc(navigationKey)}" title="${tr('clickActionTitle')}">${inner}</div>` : `<div class="act pfterm pftermclick" data-bk="${bucket}" data-act="${esc(tokens[bucket])}" title="${tr('terminalActionTitle')}">${inner}</div>`
  })
  return html || `<div class="cmeta">${tr('noPreflopStrategy')}</div>`
}

async function pfLoadStrat(decision, mine, selectedIndex) {
  try {
    const result = await pfStrat(pfVer, decision.hero, decision.situation, decision.ctx || '')
    if (mine !== pfReq) return
    const wrap = $('pfstrat')
    if (!wrap) return
    if (result.status !== 'success') { adminRaw('preflop strategy failure', result); wrap.innerHTML = `<div class="empty">${tr('strategyNotFound')}</div>`; $('pfcount').textContent = ''; return }
    pfCur = result; pfCur._label = decision.hero; pfCurL = null; pfTermBk = null
    const node = pfTree[pfPath], grid = result.grid || {}, aggregate = pfAggOf(grid, !pfActedInPath(decision.hero, pfPath))
    const tokens = pfPath ? pfPath.split(',') : []
    let priorHtml = ''
    if (selectedIndex >= 0 && selectedIndex < tokens.length) {
      const segment = tokens[selectedIndex].split(':'), otherSeat = segment[0], otherAction = pfCallMap[selectedIndex] || segment[1]
      const otherPath = tokens.slice(0, selectedIndex).join(','), otherDecision = pfTree[otherPath] && pfTree[otherPath].decision
      if (otherDecision) {
        try {
          const otherGrid = await pfStrat(pfVer, otherDecision.hero, otherDecision.situation, otherDecision.ctx || '')
          if (mine !== pfReq) return
          if (otherGrid.status === 'success') {
            const otherAggregate = pfAggOf(otherGrid.grid || {}, !pfActedInPath(otherSeat, otherPath))
            pfCurL = otherGrid; pfCurL._label = otherSeat
            priorHtml = `<div><div class="rgcap">${esc(tr('priorStrategyHeading', otherSeat, pfActLabel(otherAction), (otherAggregate.raise * 100).toFixed(0), (otherAggregate.call * 100).toFixed(0), (otherAggregate.fold * 100).toFixed(0)))}</div><div id="pfprigrid">${pfGridHtml(otherGrid.grid || {}, true)}</div><div id="pfselL" class="cellsel"><span class="sub">${esc(tr('preciseStrategyHint', tr('leftSide'), otherSeat))}</span></div></div>`
          }
        } catch { /* upstream comparison is optional */ }
      }
    }
    $('pfcount').textContent = tr('handsCount', Object.keys(grid).length, (result.actions || []).join('/'))
    const heroColumn = `<div><div class="rgcap">${esc(tr('heroStrategyHeading', decision.hero))}</div><div id="pfherogrid">${pfGridHtml(grid, true)}</div><div id="pfselR" class="cellsel"><span class="sub">${esc(tr('preciseStrategyHint', tr('rightSide'), decision.hero))}</span></div></div>`
    const emptyColumn = '<div class="range-slot-empty" aria-hidden="true"></div>'
    wrap.innerHTML = `${pfAggBar(aggregate)}<div class="ranges2">${priorHtml || heroColumn}${priorHtml ? heroColumn : emptyColumn}</div>`
    const heroGrid = $('pfherogrid')
    if (heroGrid) heroGrid.querySelectorAll('.hcell.sc').forEach((cell) => { cell.onclick = () => pfSelectHand(cell.dataset.h, cell, pfCur, 'pfselR') })
    const priorGrid = $('pfprigrid')
    if (priorGrid) priorGrid.querySelectorAll('.hcell.sc').forEach((cell) => { cell.onclick = () => pfSelectHand(cell.dataset.h, cell, pfCurL, 'pfselL') })
    const actionElement = $('pfacts')
    if (actionElement && node) {
      actionElement.innerHTML = pfActsHtml(node, aggregate)
      actionElement.querySelectorAll('.pfact').forEach((button) => { button.onclick = () => {
        const nextPath = node.acts[button.dataset.act]
        if (nextPath != null) { pfPath = nextPath; pfRangeSel = null; pfRender() }
      } })
      actionElement.querySelectorAll('.pftermclick').forEach((button) => { button.onclick = () => {
        const foldPath = node.acts && node.acts.Fold
        if (foldPath != null) {
          const index = pfPath ? pfPath.split(',').length : 0
          pfCallMap[index] = button.dataset.act; pfPath = foldPath; pfRangeSel = null; pfRender(); return
        }
        const bucket = button.dataset.bk
        pfTermBk = pfTermBk === bucket ? null : bucket
        if (heroGrid) {
          heroGrid.innerHTML = pfTermBk ? pfRangeGridHtml(grid, pfTermBk) : pfGridHtml(grid, true)
          if (!pfTermBk) heroGrid.querySelectorAll('.hcell.sc').forEach((cell) => { cell.onclick = () => pfSelectHand(cell.dataset.h, cell, pfCur, 'pfselR') })
        }
        actionElement.querySelectorAll('.pftermclick').forEach((item) => item.classList.toggle('pftermsel', item === button && Boolean(pfTermBk)))
      } })
    }
  } catch (error) {
    if (mine === pfReq) { adminRaw('preflop strategy exception', error); const wrap = $('pfstrat'); if (wrap) wrap.innerHTML = `<div class="empty">${tr('strategyLoadFailed')}</div>` }
  }
}

function pfAggBar(aggregate) {
  let bar = '', label = ''
  PF_ACTS.forEach((action) => { const frequency = aggregate[action] || 0; if (frequency > 0.0005) bar += `<span style="width:${(frequency * 100).toFixed(1)}%;background:${PF_COL[action]}"></span>`; label += `<span class="agl"><i style="background:${PF_COL[action]}"></i>${action} ${(frequency * 100).toFixed(1)}%</span>` })
  return `<div class="aggbar">${bar}</div><div class="agls">${label}</div>`
}

export function handAt(row, column) {
  return row === column ? RANKS[row] + RANKS[row] : (row < column ? RANKS[row] + RANKS[column] + 's' : RANKS[column] + RANKS[row] + 'o')
}

function pfGridHtml(grid, selectable = true) {
  let html = '<div class="hgrid">'
  for (let row = 0; row < 13; row++) for (let column = 0; column < 13; column++) {
    const hand = handAt(row, column), value = grid[hand]
    if (!value) { html += `<div class="hcell off"><span class="hl">${hand}</span></div>`; continue }
    let segments = '', title = hand + ' →'
    PF_ACTS.forEach((action) => { const frequency = value[action] || 0; if (frequency > 0.004) { segments += `<span class="seg" style="width:${(frequency * 100).toFixed(1)}%;background:${PF_COL[action]}"></span>`; title += ` ${action} ${(frequency * 100).toFixed(0)}%` } })
    html += `<div class="hcell${selectable ? ' sc' : ''}" data-h="${hand}" title="${esc(title)}"><span class="stk">${segments}</span><span class="hl">${hand}</span></div>`
  }
  return html + '</div>'
}

function hex(color) { const value = color.replace('#', ''); return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16)) }
function pfRangeGridHtml(grid, bucket) {
  const rgb = hex(PF_COL[bucket] || '#19c37d')
  let html = '<div class="hgrid">'
  for (let row = 0; row < 13; row++) for (let column = 0; column < 13; column++) {
    const hand = handAt(row, column), weight = (grid[hand] && grid[hand][bucket]) || 0
    if (weight <= 0.004) { html += `<div class="hcell off"><span class="hl">${hand}</span></div>`; continue }
    html += `<div class="hcell" title="${hand}: ${bucket} ${(weight * 100).toFixed(1)}%" style="background:rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(0.14 + 0.76 * weight).toFixed(3)})"><span class="hl">${hand}</span></div>`
  }
  return html + '</div>'
}

export function pfComboLabel(combo) {
  if (typeof combo !== 'string' || combo.length !== 4) return ''
  const rankOne = combo[0].toUpperCase(), suitOne = combo[1].toUpperCase(), rankTwo = combo[2].toUpperCase(), suitTwo = combo[3].toUpperCase()
  if (rankOne === rankTwo) return rankOne + rankTwo
  const high = PF_RANKORD[rankOne] <= PF_RANKORD[rankTwo] ? rankOne : rankTwo, low = high === rankOne ? rankTwo : rankOne
  return high + low + (suitOne === suitTwo ? 's' : 'o')
}

function pfComboTile(combo, probabilities) {
  const card = (rank, suit) => `<span class="mc" style="color:${SUITCOL[suit] || '#aaa'}">${rank}${SUITSYM[suit] || '?'}</span>`
  const raise = Math.round((probabilities.raise || 0) * 100), call = Math.round((probabilities.call || 0) * 100), fold = Math.round((probabilities.fold || 0) * 100)
  return `<span class="cmb" title="raise ${raise}% · call ${call}% · fold ${fold}%">${card(combo[0].toUpperCase(), combo[1].toLowerCase())}${card(combo[2].toUpperCase(), combo[3].toLowerCase())}<span class="cmbp">r${raise}/c${call}</span></span>`
}

function pfSelectHand(hand, cell, source, panelId) {
  source = source || pfCur
  if (!source) return
  const value = (source.grid || {})[hand], selected = $(panelId || 'pfselR')
  if (!value || !selected) return
  const ownGrid = cell && cell.closest('.hgrid')
  if (ownGrid) ownGrid.querySelectorAll('.hcell.sel').forEach((item) => item.classList.remove('sel'))
  if (cell) cell.classList.add('sel')
  const rows = PF_ACTS.map((action) => `<div class="selrow"><i style="background:${PF_COL[action]}"></i><span class="sa">${action}</span><span class="sbar"><b style="width:${((value[action] || 0) * 100).toFixed(1)}%;background:${PF_COL[action]}"></b></span><span class="sp">${((value[action] || 0) * 100).toFixed(1)}%</span></div>`).join('')
  const combos = source.combos || {}, tiles = []
  for (const combo in combos) if (pfComboLabel(combo) === hand) tiles.push(pfComboTile(combo, combos[combo]))
  const comboHtml = tiles.length ? `<div class="combos"><span class="ccap">${tr('comboStrategyCaption', tiles.length)}</span>${tiles.join('')}</div>` : ''
  selected.innerHTML = `<div class="selhdr"><b>${esc(hand)}</b> <span class="sub">${source._label ? esc(source._label) + ' · ' : ''}${value.combos || 0} combos</span></div>${rows}${comboHtml}`
}

async function boot() {
  applyPageI18n()
  document.querySelectorAll('a[href="https://pokerai.bet/login"]').forEach((link) => { link.href = LOGIN_URL })
  if (!token()) { showLocked(); return }
  showExplorer()
  $('pfv').addEventListener('change', (event) => pfLoadVersion(event.target.value))
  $('pfreset').addEventListener('click', () => { if (pfTree) { pfPath = ''; pfRangeSel = null; pfCallMap = {}; pfRender() } })
  await loadPreflopMeta()
}

if (typeof document !== 'undefined') boot().catch((error) => { adminRaw('preflop boot exception', error); toast(tr('loadFailed')) })
