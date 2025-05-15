<script setup>
import { RouterLink } from "vue-router";
import { onMounted } from 'vue';

onMounted(() => {
  const header = document.querySelector('.header');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    if (!header) return;

    if (window.scrollY < lastScrollY) {
      header.classList.remove('hide');
    } else {
      header.classList.add('hide');
    }
    lastScrollY = window.scrollY;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth > 1050) {
    const nav = document.querySelector("nav");
    const desktopItems = document.querySelectorAll(".desktop-item");
    const noDropElements = document.querySelectorAll(".no-drop");

    // Hover-funktion
    desktopItems.forEach(item => {
  item.addEventListener("mouseenter", () => {
    desktopItems.forEach(i => {
      i.classList.remove("active-hover");

      const icon = i.querySelector(".material-symbols-rounded");
      if (icon) {
        icon.textContent = "keyboard_arrow_down";
      }
    });

    item.classList.add("active-hover");

    const activeIcon = item.querySelector(".material-symbols-rounded");
    if (activeIcon) {
      activeIcon.textContent = "keyboard_arrow_up";
    }
  });
});

    // Når musen forlader hele navigationen
    nav.addEventListener("mouseleave", () => {
  desktopItems.forEach(i => {
    i.classList.remove("active-hover");
    const icon = i.querySelector(".material-symbols-rounded");
    if (icon) {
      icon.textContent = "keyboard_arrow_down";
    }
  });
});

    // Når man hover over et no-drop-element
    noDropElements.forEach(el => {
      el.addEventListener("mouseenter", () => {
        desktopItems.forEach(i => {
    i.classList.remove("active-hover");
    const icon = i.querySelector(".material-symbols-rounded");
    if (icon) {
      icon.textContent = "keyboard_arrow_down";
    }
  });
      });
    });
  }
});

function initDesktopHoverNav() {
  const nav = document.querySelector("nav");
  const desktopItems = document.querySelectorAll(".desktop-item");
  const noDropElements = document.querySelectorAll(".no-drop");

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
  if (window.innerWidth > 1050) {
    initDesktopHoverNav();
  }
}

document.addEventListener("DOMContentLoaded", handleNavBehavior);
window.addEventListener("resize", handleNavBehavior);

</script>
<template>
    <nav class="header">
        <div class="wrapper">
            <div class="logo">
                <router-link class="no-drop" :to="{ name: 'frontpage' }"><img src="../assets/images/image-removebg-preview.png" alt=""></router-link>
            </div>
            <input type="radio" name="slider" id="menu-btn">
            <input type="radio" name="slider" id="close-btn">
            <ul class="nav-links">
                <label for="close-btn" class="btn close-btn"><i class="fas fa-times"></i></label>
                <li><router-link class="no-drop" :to="{ name: 'frontpage' }">Forside</router-link></li>
                <li>
                    <router-link class="desktop-item" :to="{ name: 'om-haraldslund' }">  <span class="text">Om Haraldslund</span>
                        <span class="material-symbols-rounded">keyboard_arrow_down</span></router-link>
                    <input type="checkbox" id="showMega1">
                    <label for="showMega1" class="mobile-item">Om Haraldslund</label>
                    <div class="dropbox">
                        <div class="content">
                            <div class="row">
                                <ul class="drop-links">
                                    <li><router-link :to="{ name: 'haraldslund-praktisk-info' }">Praktisk Information</router-link></li>
                                    <li><router-link :to="{ name: 'haraldslund-priser' }">Priser</router-link></li>
                                    <li><router-link :to="{ name: 'haraldslund-café' }">Café Harald</router-link></li>
                                    <li><router-link :to="{ name: 'haraldslund-personale' }">Personale</router-link></li>
                                    <li><router-link :to="{ name: 'haraldslund-historie' }">Vores Historie</router-link></li>
                                    <li><router-link :to="{ name: 'haraldslund-bibliotek' }">Bibliotek</router-link></li>
                                    <li><router-link :to="{ name: 'haraldslund-firmaaftaler' }">Firmaaftaler</router-link></li>
                                    <li><router-link :to="{ name: 'haraldslund-brugerraad' }">Brugerråd</router-link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <router-link class="desktop-item" :to="{ name: 'motion' }"><span class="text">Motion</span>
                        <span class="material-symbols-rounded">keyboard_arrow_down</span></router-link>
                    <input type="checkbox" id="showMega2">
                    <label for="showMega2" class="mobile-item">Motion</label>
                    <div class="dropbox">
                        <div class="content">
                            <div class="row">
                                <ul class="drop-links">
                                    <li><router-link :to="{ name: 'om-motionscenteret' }">Motionscenteret</router-link></li>
                                    <li><router-link :to="{ name: 'priser-motionscenteret' }">Priser</router-link></li>
                                    <li><router-link :to="{ name: 'holdoversigt-motionscenteret' }">Holdoversigt</router-link></li>
                                    <li><router-link :to="{ name: 'regler-motionscenteret' }">Regler</router-link></li>
                                    <li><router-link :to="{ name: 'personlig-traening-motionscenteret' }">Personlig træning</router-link></li>
                                    <li><router-link :to="{ name: 'leje-af-sal-og-instruktor-motionscenteret' }">Leje af sal & Instruktør</router-link></li>
                                    <li><router-link :to="{ name: 'sib-motionscenteret' }">Sundhed i bevægelse</router-link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <router-link class="desktop-item" :to="{ name: 'vandogwellness' }"><span class="text">Vand & Wellness</span>
                        <span class="material-symbols-rounded">keyboard_arrow_down</span></router-link>
                    <input type="checkbox" id="showMega3">
                    <label for="showMega3" class="mobile-item">Vand & Wellness</label>
                    <div class="dropbox">
                        <div class="content">
                            <div class="row">
                                <ul class="drop-links">
                                    <li><router-link :to="{ name: 'svommehallen-vandogwellness' }">Svømmehallen</router-link></li>
                                    <li><router-link :to="{ name: 'wellness-vandogwellness' }">Wellness</router-link></li>
                                    <li><router-link :to="{ name: 'holdoversigt-vandogwellness' }">Holdoversigt</router-link></li>
                                    <li><router-link :to="{ name: 'priser-vandogwellness' }">Priser</router-link></li>
                                    <li><router-link :to="{ name: 'regler-vandogwellness' }">Regler</router-link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </li>
                <li><router-link class="no-drop" :to="{ name: 'moder-og-konferencer' }">Møder & Konferencer</router-link></li>
                <li><router-link class="no-drop booking-cta" :to="{ name: 'booking' }">Booking</router-link></li>
            </ul>
            <label for="menu-btn" class="btn menu-btn"><i class="fas fa-bars"></i></label>
        </div>
    </nav>
</template>

<style>

ul{
    padding-inline-start: 0;
}

nav {
    position: fixed;
    z-index: 99;
    width: 100%;
    background: var(--color-navigation);
}

nav .wrapper {
    position: relative;
    max-width: 100vw;
    padding: 0px 30px;
    height: fit-content;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
}

.wrapper .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
}

.wrapper .logo img {
    height: 100%;
}

.wrapper .logo a {
    height: 100%;
}

.wrapper .nav-links {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    gap: max(5px, 1.5vw);
}

.nav-links li {
    list-style: none;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-links li a {
    color: #f2f2f2;
    text-decoration: none;
    font-family: var(--font-heading);
    padding: 9px 15px;
    border-radius: 3px;
    transition: all 0.3s ease;
    margin: 10px 0px;
}

.nav-links li a:hover {
    text-decoration: underline 2px;
    background-color: #5f7062;
}

.nav-links li .desktop-item:hover{
    text-decoration: none;
}

.nav-links .mobile-item {
    display: none;
}

.dropbox {
    position: absolute;
    left: 50%;
    /* Placér elementet midt på skærmen horisontalt */
    transform: translateX(-50%);
    width: 100%;
    top: 60px;
    opacity: 0;
    visibility: hidden;
    max-height: 10px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.desktop-item{
    display: flex;
    align-items: center;
}

.nav-links li:hover .dropbox {
    top: 60px;
    opacity: 1;
    visibility: visible;
    max-height: 500px;
    width: 100vw;
}

.dropbox .content {
    background-color: var(--color-navigation);
    display: flex;
    width: 100%;
    padding: 5px 0px;
    justify-content: center;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.dropbox .content .row {
    /* width: calc(25% - 30px); */
    line-height: 45px;
}

.content .row img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.content .row header {
    color: #f2f2f2;
    font-size: 20px;
    font-weight: 500;
}

.content .row .drop-links {
    display: flex;
    gap: min(max(10px, 2vw), 20px);
}


.row .drop-links li a {
    padding: 10px;
    color: #d9d9d9;
    font-size: 17px;
    display: block;
}

.row .drop-links li a:hover {
    color: #f2f2f2;
}

.wrapper .btn {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    display: none;
}

.wrapper .btn.close-btn {
    position: absolute;
    right: 30px;
    top: 10px;
}

.booking-cta{
    border: 1px solid var(--color-font-2)
}

@media screen and (max-width: 1300px) {
    .wrapper .nav-links{
        padding-inline-start: 0;
        gap: 5px;
    }

    nav .wrapper{
        gap: var(--spacer-1x);
        padding: 0 10px;
    }

    .desktop-item, .no-drop, .row .drop-links li a{
        font-size: 1rem;
        padding: 0 10px;
    }
}

@media screen and (max-width: 1050px) {
    .wrapper .btn {
        display: block;
    }

    .wrapper .nav-links {
        position: fixed;
        height: 100vh;
        width: 100%;
        max-width: 40vw;
        top: 0;
        left: -100%;
        background: var(--color-navigation);
        display: block;
        padding: 50px 10px;
        overflow-y: auto;
        box-shadow: 0px 15px 15px rgba(179, 167, 167, 0.18);
        transition: all 0.3s ease;
    }

    /* custom scroll bar */
    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-track {
        background: #536256;
    }

    ::-webkit-scrollbar-thumb {
        background: #364038;
    }

    #menu-btn:checked~.nav-links {
        left: 0%;
    }

    #menu-btn:checked~.btn.menu-btn {
        display: none;
    }

    #close-btn:checked~.btn.menu-btn {
        display: block;
    }

    .close-btn{
        margin-top: 30px;
    }

    .nav-links li {
        margin: 15px 10px;
        height: fit-content;
        display: block;
    }

    .nav-links li a {
        padding: 0 20px;
        display: block;
        font-size: 20px;
        margin: 0;

    }

    #showMega1:checked ~ .dropbox,
    #showMega2:checked ~ .dropbox,
    #showMega3:checked ~ .dropbox {
        max-height: 100vh;
    }

    .nav-links .desktop-item {
        display: none;
    }

    .nav-links .mobile-item {
        display: block;
        color: #f2f2f2;
        font-size: 20px;
        font-family: var(--font-heading);
        padding-left: 20px;
        cursor: pointer;
        border-radius: 5px;
        transition: all 0.3s ease;
    }

    .nav-links .mobile-item:hover {
        background: #3A3B3C;
    }
    
    .nav-links li:hover .dropbox{
        width: 100%;
    } 

    .dropbox {
        position: static;
        top: 65px;
        opacity: 1;
        visibility: visible;
        padding: 0 20px;
        max-height: fit-content;
        overflow: hidden;
        transition: all 0.3s ease;
        transform: unset;
    }

    .nav-links li:hover .dropbox {
        top: auto;
        opacity: 1;
        visibility: visible;
        max-height: fit-content;
        width: 100%;
    }


    .dropbox .content {
        box-shadow: none;
        flex-direction: column;
        padding: 0;
    }

    .dropbox .content .row {
        width: 100%;
        line-height: unset;
    }

    .dropbox .content .row:nth-child(1),
    .dropbox .content .row:nth-child(2) {
        border-top: 0px;
    }

    .content .row .drop-links {
        border-left: 0px;
        flex-direction: column;
        margin: .5rem 0;
    }

    .row .drop-links li {
        margin: 0;
    }

    .content .row header {
        font-size: 19px;
    }

    nav .wrapper{
        justify-content: space-between;
    }

    .no-drop, .mobile-item{
        font-weight: 500;
    }

    .nav-links li .booking-cta{
    text-align: center;
    width: fit-content;
    margin-left: 20px;
}
}


@media screen and (max-width: 600px) {

    .wrapper .nav-links {
        max-width: 100%;
    }
}

nav input {
    display: none;
}

.desktop-item.active-hover {
    background-color: #364038;
}

.desktop-item.active-hover .text {
  text-decoration: underline;
}

.desktop-item.active-hover span.material-symbols-rounded {
  text-decoration: none;
}

.header {
    position: fixed;
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
}

.header.hide {
    transform: translateY(-100%);
    pointer-events: none;
}
</style>