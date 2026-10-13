// initialization

const tabs = document.querySelectorAll(".tab-content")
const tabButtons = document.querySelectorAll(".tab-btn")
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

// subtle staggered entrance for the blocks marked data-anim (needs GSAP, skipped without it)
function animateIn(panel){
    if (reduceMotion || typeof gsap === "undefined") return
    const els = panel.querySelectorAll("[data-anim]")
    if (!els.length) return
    gsap.fromTo(els, { y: 18, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.55, ease: "power2.out",
        stagger: 0.07, clearProps: "opacity,transform"
    })
}

function openTab(evt, tabName){

    const panel = document.querySelector(`[data-tab-name="${tabName}"]`)
    if (!panel) return
    if (evt && evt.preventDefault) evt.preventDefault()

    tabs.forEach((tab) => {
        tab.style.display = 'none'
    })

    tabButtons.forEach((btn) => {
        btn.classList.remove("tab-active")
        btn.setAttribute("aria-selected", "false")
        btn.tabIndex = -1
    })

    panel.style.display = 'block'

    const btn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`)
    if (btn){
        btn.classList.add("tab-active") // set current button to be active
        btn.setAttribute("aria-selected", "true")
        btn.tabIndex = 0
    }

    const pane = document.querySelector(".pane")
    if (pane) pane.scrollTop = 0

    if (history.replaceState) history.replaceState(null, "", "#" + tabName)
    animateIn(panel)
}

// arrow-key navigation between tabs
document.addEventListener("keydown", (e) => {
    const current = document.activeElement
    if (!current || !current.classList.contains("tab-btn")) return
    const list = Array.from(tabButtons)
    let i = list.indexOf(current)
    if (e.key === "ArrowRight") i = (i + 1) % list.length
    else if (e.key === "ArrowLeft") i = (i - 1 + list.length) % list.length
    else return
    e.preventDefault()
    list[i].focus()
    list[i].click()
})

function switchTheme(){
    const themeSelector = document.querySelector("#theme-selector")

    document.querySelector("html").setAttribute("data-theme", themeSelector.value)
    try { localStorage.setItem("color-theme", themeSelector.value) } catch (e) {}
}

// restore saved theme into the dropdown
try {
    const savedTheme = localStorage.getItem("color-theme")
    const sel = document.querySelector("#theme-selector")
    if (savedTheme && sel && sel.querySelector(`option[value="${savedTheme}"]`)) sel.value = savedTheme
} catch (e) {}

if (localStorage.getItem('color-mode') === 'dark' || (!('color-mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('tw-dark')
    updateToggleModeBtn()
} else {
    document.documentElement.classList.remove('tw-dark')
    updateToggleModeBtn()
}

function toggleMode(){
    //toggle between dark and light mode

    document.documentElement.classList.toggle("tw-dark")
    updateToggleModeBtn()
    
}

function updateToggleModeBtn(){

    const toggleIcon = document.querySelector("#toggle-mode-icon")
    const isDark = document.documentElement.classList.contains("tw-dark")
    const toggleBtn = document.querySelector("#toggle-mode-btn")
    if (toggleBtn) toggleBtn.setAttribute("aria-pressed", String(isDark))

    if (isDark){
        // dark mode
        if (toggleIcon){
            toggleIcon.classList.remove("bi-sun-fill")
            toggleIcon.classList.add("bi-moon-fill")
        }
        localStorage.setItem("color-mode", "dark")
        
    }else{
        if (toggleIcon){
            toggleIcon.classList.add("bi-sun-fill")
            toggleIcon.classList.remove("bi-moon-fill")
        }
        localStorage.setItem("color-mode", "light")
    }

}

// open the tab named in the URL hash (e.g. index.html#projects), else animate the first tab
;(function initTabs(){
    const name = location.hash.replace("#", "")
    if (name && document.querySelector(`[data-tab-name="${name}"]`)) openTab(null, name)
    else animateIn(document.querySelector('[data-tab-name="about"]'))
})()
