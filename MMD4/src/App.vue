<script setup>
// --- IMPORTS ---
import { RouterView, useRoute } from "vue-router";
import { ref, watch } from "vue";
import TheNav from "./components/TheNav.vue";
import TheFooter from "./components/TheFooter.vue";

// --- VARIABLER ---
const route = useRoute();

// FOKUS MAIN CONTENT
const focusMainContent = () => {
  // Fokuserer på main-elementet for at sikre, at brugeren kommer direkte til hovedindholdet
  const mainEl = document.getElementById('page-title');
  const h1El = document.querySelector('h1');
  // Hvis der ikke er et main-element, fokuseres der på det første h1-element
if (mainEl) {
  mainEl.focus();
} else if (h1El) {
  h1El.focus();
}
};



// INSPIRATIONSKILDE SKIP-LINK:  URL: Azubuko, Uchechukwu. How to Build Accessible Vue.js Applications. 21/12/2023. Vue Mastery. 2025. (online) [Accessed 24/05/2025] URL: https://www.vuemastery.com/blog/how-to-build-accessible-vuejs-applications/#setup-accessible-routing-and-a-page-title-for-each-page

// --- WATCHERS --- 
// Route ændring watcher. Anvendes til at opdatere dokumentets titel og annoncere sideændringer for skærmlæsere.
const routeAnnouncement = ref();

watch(
  () => route.path,
  () => {
        document.title = route.meta.title || "Forside - Haraldslund";
        routeAnnouncement.value = (route.meta.title ? route.meta.title + " er indlæst" : "Side indlæst");
	},
	{ immediate: true }
);
// INSPIRATIONSKILDE: Vue Mastery. Content Loading That Isn't Broken by Maria Lamardo | VueConf US 2020. (online). Youtube.com. 2025. [Accessed 25/05/2025] URL: https://www.youtube.com/watch?app=desktop&v=ALmocFPhyr8

</script>

<template>
  <div>
    <!-- Skiplink 
    Hjælper keyboard-nav-brugere med hurtigt at komme frem til hovedindholdet på siden
    Eventet @click.prevent forhindrer standard linkadfærd og kalder fokus-funktionen -->
    <a aria-live="polite" href="#" id="skipLink" class="skip-link" @click.prevent="focusMainContent">Spring til hovedindhold</a>
    <!-- 
    INSPIRATIONSKILDE CLICK.PREVENT: You, Evan. Essentials - Event Handling. (online) 2025. Vue.js. MIT-License. [Accessed 24/05/2025] URL: https://vuejs.org/guide/essentials/event-handling?utm_source=chatgpt.com 
    INSPIRATIONSKILDE SKIP-LINK: Vue Mastery. Content Loading That Isn't Broken by Maria Lamardo | VueConf US 2020. (online). Youtube.com. 2025. [Accessed 25/05/2025] URL: https://www.youtube.com/watch?app=desktop&v=ALmocFPhyr8 -->

    <!-- landmarks med aria-labels -->
    <header aria-label="Primær navigation">
        <TheNav />
    </header>
    <p id="route-announcement" role="status" aria-live="polite">{{ routeAnnouncement }}</p>
    
    <main aria-labelledby="page-title">
        <RouterView />  
    </main>
    <!-- aria-labelledby bruges til at forbinde hovedindholdet med dets overskrift, hvilket forbedrer tilgængeligheden for skærmlæsere. tabindex="-1" gør det muligt at fokusere på hovedindholdet ved hjælp af skip-linket.
    ACCESSABILITY NOTE: SKIP-LINK FUNKTION: id="main" bruges til at kunne fokusere på hovedindholdet ved brug af "Skiplink"
    tabindex="-1" gør main fokuserbart ved keyboard-nav .
    INSPIRATIONSKILDE: Vue Mastery. Content Loading That Isn't Broken by Maria Lamardo | VueConf US 2020. (online) Youtube. 2025. [Accessed 25/05/2025] URL: https://www.youtube.com/watch?app=desktop&v=ALmocFPhyr8 -->

        <footer aria-label="Sidefod">
            <TheFooter />
        </footer>
    </div>
</template>

<style scoped>
 /* -- STYLE TIL SKIP-LINK (relevant for skærmoplæsere) --- */
/* Skiplink – vises kun ved fokus */
.skip-link {
    position: absolute;
    opacity: 0;
    left: -9999px;
    top: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
}

.skip-link:focus {
    margin: var(--spacer-x1);
    padding: var(--spacer-x0-5) var(--spacer-x1);
    background-color: white;
    left: 0;
    top: 0;
    width: auto;
    height: auto;
    color: black;
    border: 2px solid black;
    z-index: 1001;
    opacity: 1;
}

/* route announcement */
#route-announcement {
    position: absolute;
    top: -9999px; /* skjuler elementet visuelt */
    left: -9999px; 
    width: 1px; 
    height: 1px; 
    overflow: hidden; 
}

/* Loading ikon - Visuelt skjult, men tilgængelig for skærmlæsere */
.visually-hidden {
  position: absolute;
  top: -9999px;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}


@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }


}

</style>
