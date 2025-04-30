import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

let lastScrollY = window.scrollY;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY < lastScrollY) {
        header.classList.remove('hide');
    } else {
        header.classList.add('hide');
    }
    lastScrollY = window.scrollY;
});

document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth > 970) {
        const nav = document.querySelector("nav");
        const desktopItems = document.querySelectorAll(".desktop-item");
        const noDropElements = document.querySelectorAll(".no-drop");

        // Hover-funktion
        desktopItems.forEach(item => {
            item.addEventListener("mouseenter", () => {
                desktopItems.forEach(i => i.classList.remove("active-hover"));
                item.classList.add("active-hover");
            });
        });

        // Når musen forlader hele navigationen
        nav.addEventListener("mouseleave", () => {
            desktopItems.forEach(i => i.classList.remove("active-hover"));
        });

        // Når man hover over et no-drop-element
        noDropElements.forEach(el => {
            el.addEventListener("mouseenter", () => {
                desktopItems.forEach(i => i.classList.remove("active-hover"));
            });
        });
    }
});

function initDesktopHoverNav() {
    const nav = document.querySelector("nav");
    const desktopItems = document.querySelectorAll(".desktop-item");
    const noDropElements = document.querySelectorAll(".no-drop");

    // Fjern gamle eventListeners hvis nødvendigt (kun vigtigt hvis du genkører funktionen)

    desktopItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
            desktopItems.forEach(i => i.classList.remove("active-hover"));
            item.classList.add("active-hover");
        });
    });

    nav.addEventListener("mouseleave", () => {
        desktopItems.forEach(i => i.classList.remove("active-hover"));
    });

    noDropElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            desktopItems.forEach(i => i.classList.remove("active-hover"));
        });
    });
}

function handleNavBehavior() {
    if (window.innerWidth > 970) {
        initDesktopHoverNav();
    }
}

document.addEventListener("DOMContentLoaded", handleNavBehavior);
window.addEventListener("resize", handleNavBehavior);
