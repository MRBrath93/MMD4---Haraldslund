<script setup>
// IMPORTS
import { RouterLink } from "vue-router";
import { ref, onMounted, onUnmounted } from 'vue';


// REAKTIVE VARIABLER
const menuOpen = ref(false);

const dropdownOpen = ref({
  omHaraldslund: false,
  motion: false,
  vandogwellness: false
});


// -- FUNKTIONER --

// FUNKTION TIL AT DETEKTERE MOBIL- OG TOUCH-DISPLAY
// Funktionen tjekker, om enheden har touch support ved at se efter 'ontouchstart' i window-objektet eller ved at tjekke navigator.maxTouchPoints. 
// 'ontouchstart' er en javascript event, der indikerer, at enheden understøtter touch input. Konkret tjekker den, om 'ontouchstart' er en del af window-objektet, eller om navigator.maxTouchPoints er større end 0.
// Hvis enheden har touch support, returnerer funktionen true, ellers false. Dette bruges til at bestemme, om dropdown-menuer skal være åbne som standard på mobile enheder.
function hasTouchSupport() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
// INSPIRATIONSKILDE: Zhan, Stephanie. Detecting Mobile vs. Desktop Browsers in JavaScript. 13/04/2023. Medium, 2025. (online) [Accessed 27/05/2025] URL:  https://medium.com/geekculture/detecting-mobile-vs-desktop-browsers-in-javascript-ad46e8d23ce5
// INSPIRATIONSKILDE: W3School. touchstart Event. (online) [Accessed 27/05/2025] W3School, By Refsnes Data. 2025. URL: https://www.w3schools.com/jsref/event_touchstart.asp


const isMobile = hasTouchSupport();

const isSmallScreen = ref(window.innerWidth <= 1050);

if (isSmallScreen.value) {
  // Hvis det er en mobil enhed, skal dropdowns være åbne som standard
  Object.keys(dropdownOpen.value).forEach(key => {
    dropdownOpen.value[key] = true;
  });
}

// REDUCERET BEVÆGELSE
// Denne variabel tjekker, om brugeren har indstillet deres præference for reduceret bevægelse i deres enheds indstillinger.
// Det gøres ved at bruge `window.matchMedia` med `(prefers-reduced-motion: reduce)`, som returnerer et MediaQueryList-objekt.
// Den returnerer true, hvis brugeren har valgt at reducere bevægelse, og anvendes til at bestemme, om visse animationer skal  fjernes for at forbedre tilgængeligheden.
const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
// INSPIRATIONSKILDE: Clark, Nat "Nathan". Checking for reduced motion preference in JavaScript. 13/09/2021. DEV Community © 2016 - 2025. (online) [Accessed 27/05/2025] URL: https://dev.to/natclark/checking-for-reduced-motion-preference-in-javascript-4lp9


function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

// Dropdowns (til mobilvisning). 
function toggleDropdown(name) {
    if (isMobile && !isSmallScreen.value) {
        dropdownOpen.value[name] = !dropdownOpen.value[name];
        // Lukker alle andre dropdowns, når en ny åbnes
        Object.keys(dropdownOpen.value).forEach(key => {
        if (key !== name) {
            dropdownOpen.value[key] = false;
        }
        });
    }
}

// Håndterer klik uden for dropdown-menuen for at lukke den
function handleOutsideClick(event) {
  if (!isMobile) {
    const target = event.target;  if (
    !target.closest('.dropbox') && 
    !target.closest('.desktop-item') && 
    !target.closest('.hover-wrapper')) {
    Object.keys(dropdownOpen.value).forEach(key => {
      dropdownOpen.value[key] = false;
    });
  }
}
}

// Funktion for at håndtere dropdown-tilstand 
function handleDropdown(name, state) {
    if (!isMobile) {
        setTimeout(() => {
            dropdownOpen.value[name] = state;
        }, 100);
    }
}

// Scroll-funktionalitet 
// headeren skjules, når brugeren scroller nedad, og vises igen, når brugeren scroller opad.
// Dette gøres for at give mere plads til indholdet, når brugeren interagerer med siden.
// 
let lastScrollY = window.scrollY;

const onScroll = () => {
    const currentScrollY = window.scrollY;

    // Hvis der er reduceret bevægelse, skal headeren altid være synlig.
    // Hvis ikke, skjules headeren ved scroll nedad efter 60px (for at undgå utilsigtet skjul ved små scrolls).
    if (currentScrollY > lastScrollY && currentScrollY > 60 && !isReduced) {
        document.querySelector('.header').classList.add('hide');
    } else {
        document.querySelector('.header').classList.remove('hide');
    }
  
    lastScrollY = currentScrollY;
};


// ONMOUNTED
onMounted(() => {
  window.addEventListener('scroll', onScroll);
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  document.removeEventListener('click', handleOutsideClick);
});



</script>
<template>
    <header>
        <nav tabindex="0" class="header" role="navigation" aria-label="Hovednavigation">
        <div class="wrapper">
            <div class="logo" 
            aria-label="Logo"
            role="button"
            >
            <router-link 
            class="no-drop" 
            aria-label="Gå til forsiden"
            :to="{ name: 'frontpage' }">
                <img src="../assets/images/image-removebg-preview.png" alt="Logo til Haraldslund Vand og Kulturhus">
            </router-link>
            </div>
            <button
            class="btn menu-main-btn"
            :aria-expanded="menuOpen.toString()"
            aria-controls="nav-links"
            @click="toggleMenu"
            >
                <span>
                    <i class="material-symbols-rounded" aria-hidden="true"> 
                        {{ menuOpen ? 'close' : 'menu'  }}
                    </i>
                    <p>{{ menuOpen ? 'Luk menu' : 'Menu' }}</p>
                </span>
                <!-- Her anvendes Vue's dynamiske binding til at ændre ikonet og teksten baseret på menuens tilstand.
                     Hvis menuen er åben, vises 'close' ikonet og teksten 'Luk menu', ellers vises 'menu' ikonet og teksten 'Menu'. -->
            </button>
            <ul 
            class="nav-links"
            id="nav-links"
            :class="{ open: menuOpen }" 
            aria-label="Menu links"
            >
                <li role="button link"><router-link class="no-drop text desktop-item" :to="{ name: 'frontpage' }">Forside</router-link></li>
                <li
                @mouseenter="handleDropdown('omHaraldslund', true)"
                @mouseleave="handleDropdown('omHaraldslund', false)"
                @click="toggleDropdown('omHaraldslund')"
                :aria-expanded="dropdownOpen.omHaraldslund.toString()"
                aria-controls="dropbox-omHaraldslund"
                role="button link"
                >
                    <router-link 
                    :to="{ name: 'om-haraldslund' }" >
                        <span class="hover-wrapper"
                        :class ="{'hover-wrapper-active': dropdownOpen.omHaraldslund }">
                            <p class="text desktop-item">Om Haraldslund </p>
                            <i class="material-symbols-rounded" aria-hidden="true">{{ isSmallScreen ? '' : dropdownOpen.omHaraldslund ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
                            </i>
                            <!-- Vha. ternary operator vises et ikon, der indikerer om dropdown-menuen er åben eller lukket. Derudover tjekker den om "isSmallScreen" er true, og hvis det er tilfældet, vises intet ikon. -->
                        </span>
                    </router-link>
                    <div class="dropbox"
                    id="dropbox-omHaraldslund"
                    v-show="dropdownOpen.omHaraldslund"
                    :aria-hidden="(!dropdownOpen.omHaraldslund).toString()"
                    >
                            <div class="row">
                                <ul class="drop-links">
                                    <li role="button link"><router-link :to="{ name: 'haraldslund-praktisk-info' }">Praktisk Information</router-link></li>
                                    <li role="button link"><router-link :to="{ name: 'haraldslund-priser' }">Prisoversigt</router-link></li>
                                    <li role="button link"><router-link :to="{ name: 'haraldslund-cafe' }">Café Harald</router-link></li>
                                    <li role="button link"><router-link :to="{ name: 'haraldslund-personale' }">Personale</router-link></li>
                                    <li role="button link"><router-link :to="{ name: 'haraldslund-historie' }">Vores Historie</router-link></li>
                                    <li role="button link"><router-link :to="{ name: 'haraldslund-bibliotek' }">Bibliotek</router-link></li>
                                    <li role="button link"><router-link :to="{ name: 'haraldslund-firmaaftaler' }">Firmaaftaler</router-link></li>
                                    <li role="button link"><router-link :to="{ name: 'haraldslund-brugerraad' }">Brugerråd</router-link></li>
                                    <li role="button link"><router-link :to="{ name: 'haraldslund-events' }">Events</router-link></li>
                                    <li role="button link"><router-link :to="{ name: 'haraldslund-aktivitetsoversigt' }">Aktivitetsoversigt</router-link></li>
                                </ul>
                            </div>
                    </div>
                </li>
                <li
                @mouseenter="handleDropdown('motion', true)"
                @mouseleave="handleDropdown('motion', false)"
                @click="toggleDropdown('motion')"
                :aria-expanded="dropdownOpen.motion.toString()"
                aria-controls="dropbox-motion"
                role="button link"
                >
                    <router-link :to="{ name: 'motion' }">
                        <span class="hover-wrapper"
                        :class ="{ 'hover-wrapper-active': dropdownOpen.motion }">
                            <p class="text desktop-item">Motion</p>
                            <i class="material-symbols-rounded" aria-hidden="true"> {{ isSmallScreen ? '' : dropdownOpen.motion ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }} </i>
                        </span>
                    </router-link>
                    <div class="dropbox"
                    id="dropbox-motion"
                    v-show="dropdownOpen.motion"
                    :aria-hidden="(!dropdownOpen.omHaraldslund).toString()"
                    >
                        <div class="row">
                            <ul class="drop-links">
                                <li role="button link"><router-link :to="{ name: 'om-motionscenteret' }">Motionscenteret</router-link></li>
                                <li role="button link"><router-link :to="{ name: 'priser-motionscenteret' }">Priser</router-link></li>
                                <li role="button link"><router-link :to="{ name: 'holdoversigt-motionscenteret' }">Holdoversigt</router-link></li>
                                <li role="button link"><router-link :to="{ name: 'regler-motionscenteret' }">Regler</router-link></li>
                                <li role="button link"><router-link :to="{ name: 'personlig-traening-motionscenteret' }">Personlig træning</router-link></li>
                                <li role="button link"><router-link :to="{ name: 'leje-af-sal-og-instruktor-motionscenteret' }">Leje af sal & Instruktør</router-link></li>
                                <li role="button link"><router-link :to="{ name: 'sib-motionscenteret' }">Sundhed & bevægelse</router-link></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li
                @mouseenter="handleDropdown('vandogwellness', true)"
                @mouseleave="handleDropdown('vandogwellness', false)"
                @click="toggleDropdown('vandogwellness')"
                :aria-expanded="dropdownOpen.vandogwellness.toString()"
                role="button link"
                >
                    <router-link :to="{ name: 'vandogwellness' }">
                    <span class="hover-wrapper"
                    :class ="{ 'hover-wrapper-active': dropdownOpen.vandogwellness }"
                    >
                        <p class="text desktop-item">Vand & Wellness</p>
                        <i class="material-symbols-rounded" aria-hidden="true"> {{ isSmallScreen ? '' : dropdownOpen.vandogwellness ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }} </i>
                    </span>
                    </router-link>
                    <div class="dropbox"
                    id="dropbox-vandogwellness"
                    v-show="dropdownOpen.vandogwellness"
                    :aria-hidden="(!dropdownOpen.omHaraldslund).toString()"              
                    >
                        <div class="row">
                            <ul class="drop-links">
                                <li role="button link"><router-link :to="{ name: 'svommehallen-vandogwellness' }">Svømmehallen</router-link></li>
                                <li role="button link"><router-link :to="{ name: 'wellness-vandogwellness' }">Wellness</router-link></li>
                                <li role="button link"><router-link :to="{ name: 'holdoversigt-vandogwellness' }">Holdoversigt</router-link></li>
                                <li role="button link"><router-link :to="{ name: 'priser-vandogwellness' }">Priser</router-link></li>
                                <li role="button link"><router-link :to="{ name: 'regler-vandogwellness' }">Regler</router-link></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li role="button link"><router-link class="no-drop text desktop-item" :to="{ name: 'moder-og-konferencer' }">Møder & Konferencer</router-link></li>
                <li role="button link"><router-link class="no-drop text desktop-item" id="booking-cta" :to="{ name: 'booking' }">Booking</router-link></li>
            </ul>
        </div>
    </nav>
    </header>
</template>

<style scoped>

ul{
    padding-inline-start: 0;
}


.header {
    position: fixed;
    top: 0;
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
}

.header.hide {
    transform: translateY(-100%);
    pointer-events: none;
}

nav {
    position: fixed;
    z-index: 99;
    width: 100vw;
    background: var(--color-navigation);
    padding: 10px 0;
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
    gap: max(2px, 1vw);
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

/* UL WRAPPER */
.wrapper .nav-links {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    gap: max(3px, 1vw);
}

.nav-links li {
    list-style: none;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

    /* MOBIL STØRRELSE */
    .nav-links li a {
        display: block;
        color: var(--color-font-2);
        /* padding-left: 20px; */
        border-radius: 5px;
        width: max-content;
        transition: all 0.3s ease;
    }
    
    .text {
        font-family: var(--font-heading);
        font-weight: 500;
        text-decoration: none;
        font-size: clamp(1rem, 1.2vw, 1.2rem);
        padding: 9px 15px;
        cursor: pointer;
        height: min-content;
        color: var(--color-font-2);
        border-radius: 5px;
    }

    .hover-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-right: 3px;
        border-radius: 5px;
    }

.hover-wrapper p:hover, #booking-cta:hover, .drop-links li a:hover, .text:hover {
    text-decoration: underline 2px;
    text-underline-offset: var(--spacer-x0-5);
    background-color: #5f7062;
    color: var(--color-font-2);
    transition: all 0.3s ease;
}

.hover-wrapper:hover {
    background-color: #5f7062;
    transition: all 0.3s ease;
}

.nav-links .mobile-item {
    display: none;
}

.nav-links li:hover .dropbox {
    top: 60px;
    opacity: 1;
    visibility: visible;
    max-height: 500px;
    width: 100vw;
}

.nav-links p:hover i.material-symbols-rounded{
  text-decoration: none;
} 

.dropbox {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    top: 60px;
    opacity: 0;
    visibility: hidden;
    max-height: 10px;
    overflow: hidden;
    transition: all 0.3s ease;
    background-color: var(--color-navigation);
    padding: 10px 0px;
    display: flex;
    justify-content: center;
}

.desktop-item{
    display: flex;
    align-items: center;
    padding: 16px; /** Skubber baren nok ned i undermenuen til at onleave ikke bliver triggered */
}

.dropbox .row {
    line-height: 45px;
}

.dropbox .row img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.drop-links {
    display: flex;
    gap: min(max(10px, 2vw), 20px);
    padding: 5px;
}

.row .drop-links li a {
    padding: 10px;
    color: #d9d9d9;
    font-size: 17px;
    display: block;
}

.wrapper .btn {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    display: none;
    background-color: var(--color-navigation);
    border: none;
}

.wrapper .btn p {
    font-family: var(--font-heading);
    font-weight: 300;
    font-size: 0.85rem;
    margin-left: 5px;
    color: var(--color-font-2);
}

.wrapper span {
    display: flex;
    align-items: center;
    justify-content: center;
}

.wrapper .btn.close-btn {
    position: absolute;
    right: 30px;
    top: 10px;
}

#booking-cta{
    border: 1px solid var(--color-font-2);
    padding: 1rem;
    border-radius: var(--border-radius);
    
}



@media screen and (min-width: 1200px) {
    .wrapper .nav-links{
        padding-inline-start: 0;
        gap: inherit; 
        /* // Beholder gap fra wrapper */
    }

    nav .wrapper{
        padding: 0 10px;
    }


    .drop-links {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }
    }


@media screen and (min-width: 1051px) {
    .hover-wrapper-active {
    background-color: #414d43;
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
        top: 50px;
        right: -9999px;
        background: var(--color-navigation);
        display: block;
        padding: 20px 10px;
        overflow-y: auto;
        box-shadow: 0px 15px 15px rgba(179, 167, 167, 0.18);
        transition: all 0.3s ease;
    }

      .wrapper .nav-links.open {
        right: 0;
  }

  .row .drop-links li a {
    padding: 5px 10px;
    width: 100%;
    font-size: 18px;
  }

  .desktop-item {
    font-size: 20px;
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

    .nav-links li {
        margin: 5px 10px;
        height: fit-content;
        display: block;
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

    .dropbox .row {
        box-shadow: none;
        flex-direction: column;
        padding: 0;
        width: 100%;
        line-height: unset;
    }


    .dropbox .row .drop-links {
        border-left: 0px;
        flex-direction: column;
        margin: .5rem 0;
    }

    .row .drop-links li {
        margin: 0;
    }

    nav .wrapper{
        justify-content: space-between;
    }

    .nav-links li #booking-cta{
    text-align: center;
    width: fit-content;
    margin-left: 20px;
}
}


@media screen and (max-width: 600px) {

    .wrapper .nav-links {
        max-width: 100vw;
    }

    .wrapper .nav-links.open {
        left: 0;
    }
}

</style>