// 陈思怡 · 个人主页（蓝调版）交互脚本
//
// 沿用课程的渐进增强思路：JS 挂了，页面照常能读、能跳转，
// 只是少了一些提示和动效。CSS 只在 <html> 有 .js 类时才先隐藏
// 待显现元素，所以没 JS 时内容全部直接可见。

document.documentElement.classList.add('js')

const progressBar = document.querySelector('#reading-progress')
const indicator = document.querySelector('#section-indicator')
const toTopButton = document.querySelector('#to-top')
const ringFg = document.querySelector('.ring-fg')
const RING_LEN = 100.53 // 2π × 16，返回顶部圆环周长
const navLinks = document.querySelectorAll('nav a')
const sections = document.querySelectorAll('main .hero[id], main section[id]')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

// 导航文字就是栏目名，直接拿来用，不另维护对照表
const sectionNames = new Map()
navLinks.forEach(link => {
  sectionNames.set(link.getAttribute('href'), link.textContent.trim())
})

// ---------- 顶部阅读进度条 ----------
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0
  progressBar.style.width = `${ratio * 100}%`
  if (ringFg) ringFg.style.strokeDashoffset = `${RING_LEN * (1 - ratio)}`
}

// ---------- 当前栏目：右下角徽标 + 导航高亮 ----------
function showCurrent(hash) {
  const current = hash || '#about'
  indicator.textContent = sectionNames.get(current) || ''
  navLinks.forEach(link => {
    const isCurrent = link.getAttribute('href') === current
    link.classList.toggle('is-current', isCurrent)
    if (isCurrent) link.setAttribute('aria-current', 'location')
    else link.removeAttribute('aria-current')
  })
}

window.addEventListener('hashchange', () => showCurrent(location.hash))
showCurrent(location.hash)

// ---------- 返回顶部 ----------
toTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' })
  history.replaceState(null, '', location.pathname)
  showCurrent('#about')
})

// ---------- 滚动：进度条 + 返回顶部按钮显隐 ----------
window.addEventListener('scroll', () => {
  updateProgress()
  toTopButton.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6)
}, { passive: true })
updateProgress()

// ---------- 滚动监听栏目切换（scroll spy） ----------
const spy = new IntersectionObserver(
  entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) showCurrent(`#${entry.target.id}`)
    }
  },
  { rootMargin: '-45% 0px -45% 0px' },
)
sections.forEach(section => spy.observe(section))

// ---------- 滚动显现 ----------
const revealTargets = document.querySelectorAll(
  '.section-heading, .timeline-row, .project-card, .skill-card, .records-list li',
)
if (reducedMotion.matches) {
  revealTargets.forEach(el => el.classList.add('is-visible'))
} else {
  const reveal = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.15 },
  )
  revealTargets.forEach(el => reveal.observe(el))
}

// ---------- 首屏打字机效果 ----------
const typewriter = document.querySelector('#typewriter')
const roleText = '软件技术专业学生，前端开发学习者'
function typeRole() {
  if (!typewriter) return
  if (reducedMotion.matches) {
    typewriter.textContent = roleText
    return
  }
  let i = 0
  const timer = setInterval(() => {
    typewriter.textContent = roleText.slice(0, ++i)
    if (i >= roleText.length) clearInterval(timer)
  }, 90)
}
typeRole()

// ---------- 作品卡片 3D 微倾斜（仅桌面、非减动效时） ----------
const workCards = document.querySelectorAll('.work-card')
if (window.matchMedia('(hover: hover)').matches && !reducedMotion.matches) {
  workCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      card.style.transform = `translateY(-5px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`
    })
    card.addEventListener('mouseleave', () => {
      card.style.transform = ''
    })
  })
}

// ---------- 头像彩蛋 ----------
const avatar = document.querySelector('#avatar')
let toastTimer
function showToast(text) {
  let toast = document.querySelector('.avatar-toast')
  if (!toast) {
    toast = document.createElement('p')
    toast.className = 'avatar-toast'
    toast.setAttribute('aria-live', 'polite')
    document.body.append(toast)
  }
  toast.textContent = text
  toast.classList.add('is-show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove('is-show'), 2600)
}
if (avatar) {
  avatar.addEventListener('click', () => {
    showToast('你好，我是陈思怡。这一页是我和 Git 一起写的。')
  })
}
