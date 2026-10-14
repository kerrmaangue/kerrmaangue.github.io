// Case-study pages: dark/light toggle (shares the saved mode with index.html) + gentle entrance
const iconEl = document.querySelector("#toggle-mode-icon")
const btnEl = document.querySelector("#toggle-mode-btn")

function syncModeIcon(){
    const dark = document.documentElement.classList.contains("tw-dark")
    iconEl.classList.toggle("bi-moon-fill", dark)
    iconEl.classList.toggle("bi-sun-fill", !dark)
    btnEl.setAttribute("aria-pressed", String(dark))
    try { localStorage.setItem("color-mode", dark ? "dark" : "light") } catch (e) {}
}
btnEl.addEventListener("click", () => {
    document.documentElement.classList.toggle("tw-dark")
    syncModeIcon()
})
syncModeIcon()

if (typeof gsap !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.fromTo("[data-anim]", { y: 18, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.55, ease: "power2.out", stagger: 0.07, clearProps: "opacity,transform"
    })
}
