// ============================================================
// render.js —— 把 index.html 底部的 SITE_DATA 渲染成页面内容
// 覆盖：信息卡 / 经历时间轴 / 项目 / 技能 / 学习记录。
// 作品区由 works-render.js 单独渲染（数据共用 SITE_DATA.works）。
// 日常维护不需要改这个文件：新增内容只改 index.html 的数据块。
// ============================================================
(function () {
  'use strict'

  var data = window.SITE_DATA || {}

  // 通用渲染器：把 items 逐条转成 DOM 节点，挂到 selector 容器里
  function fillList(selector, items, makeItem) {
    var box = document.querySelector(selector)
    if (!box || !items || !items.length) return
    var fragment = document.createDocumentFragment()
    items.forEach(function (item) { fragment.append(makeItem(item)) })
    box.append(fragment)
  }

  // 首屏四张信息卡（SITE_DATA.facts）
  fillList('.facts-grid', data.facts, function (f) {
    var card = document.createElement('div')
    card.className = 'fact-card'
    var label = document.createElement('span')
    label.className = 'fact-label'
    label.textContent = f.label
    var value = document.createElement('strong')
    value.textContent = f.value
    card.append(label, value)
    return card
  })

  // 经历时间轴（SITE_DATA.timeline）
  fillList('.timeline', data.timeline, function (t) {
    var row = document.createElement('div')
    row.className = 'timeline-row'
    var time = document.createElement('time')
    time.className = 'timeline-time'
    time.textContent = t.time
    var axis = document.createElement('span')
    axis.className = 'timeline-axis'
    axis.setAttribute('aria-hidden', 'true')
    var body = document.createElement('div')
    body.className = 'timeline-body'
    var h3 = document.createElement('h3')
    h3.textContent = t.title
    var p = document.createElement('p')
    p.textContent = t.desc
    body.append(h3, p)
    row.append(time, axis, body)
    return row
  })

  // 项目（SITE_DATA.projects）
  fillList('.project-grid', data.projects, function (p) {
    var card = document.createElement('article')
    card.className = 'project-card'
    var badge = document.createElement('span')
    badge.className = 'project-badge'
    badge.textContent = p.badge
    var h3 = document.createElement('h3')
    h3.textContent = p.title
    var desc = document.createElement('p')
    desc.textContent = p.desc
    card.append(badge, h3, desc)
    return card
  })

  // 技能（SITE_DATA.skills，顶边颜色按 level 自动映射，数据里不用填）
  var LEVEL_CLASS = { '熟练': 'level-solid', '学习中': 'level-growing', '已跑通': 'level-done' }
  fillList('.skill-grid', data.skills, function (s) {
    var item = document.createElement('li')
    item.className = 'skill-card ' + (LEVEL_CLASS[s.level] || 'level-growing')
    var name = document.createElement('span')
    name.className = 'skill-name'
    name.textContent = s.name
    var desc = document.createElement('span')
    desc.className = 'skill-desc'
    desc.textContent = s.desc
    var level = document.createElement('span')
    level.className = 'skill-level'
    level.textContent = s.level
    item.append(name, desc, level)
    return item
  })

  // 学习记录（SITE_DATA.records，序号 01/02/03 由 CSS 自动生成）
  fillList('.records-list', data.records, function (r) {
    var item = document.createElement('li')
    var strong = document.createElement('strong')
    strong.textContent = r.title
    var span = document.createElement('span')
    span.textContent = r.desc
    item.append(strong, span)
    return item
  })
})()
