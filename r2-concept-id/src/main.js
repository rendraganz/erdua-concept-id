import './style.css'
import { renderApp } from './ui.js'

function initTheme() {
  let theme = 'light'
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') theme = saved
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) theme = 'dark'
  } catch {}
  document.documentElement.setAttribute('data-theme', theme)
}

initTheme()
const root = document.querySelector('#app')
renderApp(root)
