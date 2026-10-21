// initialization

const tabs = document.querySelectorAll(".tab-content")
const tabButtons = document.querySelectorAll(".tab-btn")
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

// subtle staggered entrance for the blocks marked data-anim (needs GSAP, skipped without it)
function animateIn(panel){
    if (!panel || reduceMotion || typeof gsap === "undefined") return
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

    if (tabName === "about") {
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh()
        setTimeout(maybePlayTrackRecord, 60)
    }
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
    try { localStorage.setItem("color-theme-v2", themeSelector.value) } catch (e) {}
}

// restore saved theme into the dropdown
try {
    const savedTheme = localStorage.getItem("color-theme-v2")
    const sel = document.querySelector("#theme-selector")
    if (savedTheme && sel && sel.querySelector(`option[value="${savedTheme}"]`)) sel.value = savedTheme
} catch (e) {}

// dark is the default; only an explicit saved "light" turns it off (same key as the rest of the site)
let savedMode = "dark"
try { savedMode = localStorage.getItem("theme-v2") || "dark" } catch (e) {}
document.documentElement.classList.toggle("tw-dark", savedMode !== "light")
updateToggleModeBtn()

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
        try { localStorage.setItem("theme-v2", "dark") } catch (e) {}
        
    }else{
        if (toggleIcon){
            toggleIcon.classList.add("bi-sun-fill")
            toggleIcon.classList.remove("bi-moon-fill")
        }
        try { localStorage.setItem("theme-v2", "light") } catch (e) {}
    }

}

// open the tab named in the URL hash (e.g. index.html#projects), else animate the first tab
;(function initTabs(){
    const name = location.hash.replace("#", "")
    if (name && document.querySelector(`[data-tab-name="${name}"]`)) openTab(null, name)
    else animateIn(document.querySelector('[data-tab-name="about"]'))
})()


/* ------------------------------------------------------------------
   Track record: count-up numbers + slide-up cards, triggered on scroll
   (GSAP + ScrollTrigger). Final numbers are already in the HTML, so the
   section reads correctly with no JS, no GSAP, or reduced motion.
------------------------------------------------------------------- */
let trackPlayed = false
const trackEl = document.querySelector("#track-record")

function formatCount(el, value){
    el.textContent = (el.dataset.prefix || "") + Math.round(value) + (el.dataset.suffix || "")
}

function playTrackRecord(){
    if (trackPlayed || !trackEl) return
    trackPlayed = true
    if (reduceMotion || typeof gsap === "undefined") return

    const cards = trackEl.querySelectorAll(".track-card")
    const bars  = trackEl.querySelectorAll(".bar")
    cards.forEach((c) => {
        const el = c.querySelector(".count")
        formatCount(el, 0)
    })
    gsap.fromTo(cards, { y: 28, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
        stagger: 0.12, clearProps: "opacity,transform"
    })
    gsap.fromTo(bars, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power2.out", stagger: 0.12, delay: 0.2 })
    trackEl.querySelectorAll(".count").forEach((el, i) => {
        const state = { v: 0 }
        gsap.to(state, {
            v: Number(el.dataset.count), duration: 1.6, delay: 0.1 + i * 0.12, ease: "power2.out",
            onUpdate: () => formatCount(el, state.v),
            onComplete: () => { el.textContent = el.dataset.final }
        })
    })
}

function inViewport(el){
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.top < window.innerHeight * 0.92 && r.bottom > 0
}

function maybePlayTrackRecord(){
    if (trackEl && !trackPlayed && inViewport(trackEl)) playTrackRecord()
}

if (trackEl) {
    trackEl.querySelectorAll(".count").forEach((el) => { el.dataset.final = el.textContent.trim() })

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined" && !reduceMotion) {
        gsap.registerPlugin(ScrollTrigger)
        // desktop scrolls inside .pane, mobile scrolls the page
        const mm = gsap.matchMedia()
        mm.add("(min-width: 1024px)", () => {
            ScrollTrigger.create({ trigger: trackEl, scroller: ".pane", start: "top 92%", once: true, onEnter: playTrackRecord })
        })
        mm.add("(max-width: 1023px)", () => {
            ScrollTrigger.create({ trigger: trackEl, start: "top 92%", once: true, onEnter: playTrackRecord })
        })
    }
    // covers the case where About is already in view on load / tab switch
    window.addEventListener("load", maybePlayTrackRecord)
}

/* ------------------------------------------------------------------
   Contact dialog + inquiry form
   - Every .js-open-contact link opens the dialog (without JS they fall back
     to a plain mailto: link).
   - If data-endpoint on the <form> is set (a Formspree URL, for example), the
     form POSTs JSON there and Formspree emails it to the address configured
     on that form.
   - Otherwise it opens the visitor's email app with the message prefilled for
     data-mailto, which works on any static host with no backend.
------------------------------------------------------------------- */
;(function initContactDialog(){
    const dlg = document.querySelector("#contact-dialog")
    if (!dlg || typeof dlg.showModal !== "function") return
    document.querySelectorAll(".js-open-contact").forEach((el) => {
        el.addEventListener("click", (e) => { e.preventDefault(); dlg.showModal() })
    })
    dlg.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => dlg.close()))
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close() }) // click on the backdrop
})()

;(function initInquiryForm(){
    const form = document.querySelector("#inquiry-form")
    if (!form) return
    const status = document.querySelector("#form-status")
    const btn = form.querySelector(".submit-btn")

    function say(msg, ok){
        status.textContent = msg
        status.className = "form-status " + (ok ? "ok" : "err")
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(form).entries())
        if (data.website) return // honeypot tripped: silently drop

        const bad = Array.from(form.querySelectorAll("[required]")).find((f) => !f.value.trim() || !f.checkValidity())
        if (bad){
            bad.focus()
            say(bad.type === "email" ? "Please enter a valid email address." : "Please complete the required fields.", false)
            return
        }

        const endpoint = form.dataset.endpoint
        if (endpoint){
            btn.disabled = true
            say("Sending...", true)
            try {
                const res = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify({
                        _subject: "Portfolio inquiry: " + data.service,
                        name: data.name, email: data.email, contact: data.contact,
                        service: data.service, budget: data.budget, details: data.details
                    })
                })
                if (!res.ok) throw new Error("bad response")
                form.reset()
                say("Thanks " + data.name.split(" ")[0] + ", your inquiry has been sent. I will get back to you soon.", true)
            } catch (err) {
                say("Something went wrong. Please email " + form.dataset.mailto + " directly.", false)
            } finally {
                btn.disabled = false
            }
            return
        }

        const subject = encodeURIComponent("Portfolio inquiry: " + data.service)
        const body = encodeURIComponent(
            "Name: " + data.name + "\nEmail: " + data.email +
            (data.contact ? "\nPhone / social: " + data.contact : "") +
            "\nService: " + data.service +
            (data.budget ? "\nEstimated budget: " + data.budget : "") +
            "\n\nProject details:\n" + data.details
        )
        window.location.href = "mailto:" + form.dataset.mailto + "?subject=" + subject + "&body=" + body
        say("Opening your email app with the message ready to send. If nothing opens, write to " + form.dataset.mailto + ".", true)
    })
})()
