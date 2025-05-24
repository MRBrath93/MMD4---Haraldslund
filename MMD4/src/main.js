import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// KILDE PINIA: Pinia. Vue.js. 2020. NPM, Inc. 2014-2025. (online) [accessed 19/05/2025] URL: https://www.npmjs.com/package/pinia - MIT License Copyright (c) 2020 Eduardo San Martin Morote

import App from './App.vue'
// KILDE VUE APP: Vue.JS. Essentials: Creating A Vue Application. Vue.js. 2014-2025. (online) [accessed 19/05/2025] URL: https://vuejs.org/guide/introduction.html - MIT License Copyright (c) 2014 Evan You

import router from './router'
// KILDE ROUTER: Vue Router. Vue.js. 2016. NPM, Inc. 2014-2025. (online) [accessed 19/05/2025] URL: https://www.npmjs.com/package/vue-router - MIT License Copyright (c) 2016 Evan You

import breadcrumbs from 'vue-3-breadcrumbs'
// KILDE Breadcrumbs plugin: Merkusshin-AY. Vue-3-breadcrumbs. 2022. NPM, Inc. 2014-2025. (online) [accessed 19/05/2025] URL: https://www.npmjs.com/package/vue-3-breadcrumbs - MIT License Copyright (c) 2022 Merkushin-AY

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(breadcrumbs, {
    includeComponent: false,
})

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


window.onload = () => {
    window.scrollTo(0, 0);
};
