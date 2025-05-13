<script setup>
// --- IMPORTS ---
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { defineProps } from 'vue';

// --- IMPORTS TIL ROUTER ---
const props = defineProps({
  label: {
    type: Array,
    default: () => [
      { id: 1, label: "Om Motionscenteret", name: "om-motionscenteret" },
      { id: 2, label: "Holdoversigt", name: "holdoversigt-motionscenteret" },
      { id: 3, label: "Priser", name: "priser-motionscenteret" },
      { id: 4, label: "Regler", name: "regler-motionscenteret" },
      { id: 5, label: "Personlig træning", name: "personlig-traening-motionscenteret" },
      { id: 6, label: "Leje af sal & instruktør", name: "leje-af-sal-og-instruktor-motionscenteret" },
      { id: 7, label: "Sundhed & bevægelse", name: "sib-motionscenteret" },
    ],
  },
});

// --- VARIABLER ---
// Variabler til dropdown-menuen
const isOpen = ref(false);
const selectedLabel = ref(null);
const dropdownRef = ref(null);

// Variabel til sticky navigation
const isSticky = ref(false);

// --- FUNKTIONER ---
// HÅNDTERING AF STICKY NAVIGATION
// Eventlistener til at lukke dropdown-menuen, når der klikkes udenfor
// metoden getBoundingClientRect() bruges til at få positionen af elementet i forhold til viewporten. 
// Konkret returnerer metoden et "DOMRect" objekt, der indeholder oplysninger om elementets størrelse og position.
const handleScroll = () => {
  const nav = dropdownRef.value;
  if (nav) {
    const offset = nav.getBoundingClientRect().top;
    isSticky.value = offset <= 0; // Bliver true, når elementet når toppen af viewporten.
  }
};
// KILDEREFERENCE GetBoundingClientRect: MDN - Mozilla Foundation. 2025. Element: getBoundingClientRect() method. (online) [Accessed 13/05/2025] URL: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect

// ÅBNE OG LUKKE DROPDOWN-MENU PÅ SMÅ SKÆRME
// Eventlistener til at lukke dropdown-menuen, når der klikkes udenfor elementet
// event.target bruges til at få fat i det element, der blev klikket på.
// contains() metoden bruges til at kontrollere, om dropdownRef.value indeholder det klikkede element.
// Hvis det klikkede element ikke er en del af dropdownRef.value, sættes "isOpen" til false, hvilket lukker dropdown-menuen.
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};
// INSPIRATIONSKILDE: Aparna Rathore. 24/07/2023. How to Detect Clicks Outside an Element with Vue.js?. Medium. (online) [Accessed 13/05/2025] URL: https://rathoreaparna678.medium.com/how-to-detect-clicks-outside-an-element-with-vue-js-64f05804445a

// KLIK PÅ DROPDOWN-MENU
// Funktion til at håndtere klik på dropdown-menuen, der kaldes ved @click på router-linket.
// Når brugeren vælger et <li>-punkt i menuen, opdateres den valgte label og dropdown-menuen lukkes.
// "item" er det valgte <li> i menuen og dets label sendes fra router-linket til funktionen.
const selectItem = (item) => {
  selectedLabel.value = item.label;
  isOpen.value = false; 
};

// LIFECYCLE HOOKS
// Lifecycle hooks til at tilføje og fjerne eventlistenere ved click og scroll
onMounted(() => {
    window.addEventListener("scroll", handleScroll);
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
  document.removeEventListener('click', handleClickOutside);
});


</script>


<template>
    <main>
    <section 
    class="intern-nav" 
    ref="dropdownRef" 
    :class="{ sticky: isSticky }"
    >
        <button @click="isOpen = !isOpen" 
        class="dropdown-toggle" 
        label="Tryk for at åbne den interne navigation for siden"> 
        <span class="button-label">Indhold:</span> {{ selectedLabel || "Vælg side" }}
            <span class="material-symbols-rounded" aria-hidden="true">
                {{ isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
            </span>
        </button>
        <ul 
        class="small intern-nav-container dropdown" 
        v-show="isOpen"
        >
            <li v-for="(item, index) in label" :key="index">
                <router-link 
                :to="{ name: item.name }" 
                @click="selectItem(item)"
                >
                    <span>{{ item.label }}</span>
                </router-link>
            </li>
        </ul>
    </section>
</main>
</template>
  
<style scoped>

.intern-nav {
    margin: 0 auto var(--spacer-x1);
    width: 100vw;
    background: var(--color-btn-primary);
  }

.intern-nav.sticky {
    position: fixed;
    top: 0;
    z-index: 100;
    width: 100%;
    background-color: var(--color-btn-primary);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-size: clamp(1rem, 2vw, 1.125rem);
}
  
.dropdown-toggle {
    background: var(--color-btn-primary);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 100%;
    padding: var(--spacer-x1);
  }
.intern-nav-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-x1);
    padding: var(--spacer-x0-5) var(--spacer-x1);
    width: max-content;
}
  
li {
    list-style-type: none;
}
  
span {
    font-size: clamp(0.875rem, 1.5vw, 1rem);
}
    
.button-label {
    font-weight: bold;
    padding-right: var(--spacer-x0-25);
}


@media screen and (min-width: 1200px) {
.dropdown-toggle {
    display: none; 
}
  
.intern-nav-container {
    display: flex !important;
    flex-direction: row;
    box-shadow: none;
    background: none;
    padding: 0;
    margin-top: 0;
    gap: var(--spacer-x2);
}
  
.intern-nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: var(--spacer-x3);
    background-color: var(--color-body-background);
    padding: var(--spacer-x1);
}

.router-link-exact-active {
    text-decoration: underline;
    text-underline-offset: var(--spacer-x0-5);
}

span:hover {
    text-decoration: underline;
    cursor: pointer;
    text-underline-offset: var(--spacer-x0-5);
}
  
.router-link-exact-active {
    font-weight: bold;
}
/* INSPIRATIONSKILDE: Vue Router. Active links. (online) 2014. Evan You, Eduardo San Martin Morote. [Accessed 13/05/2025] URL: https://router.vuejs.org/guide/essentials/active-links */
}
</style>

<!-- 
 INSPIRATIONSKILDE: mmmrks. Building a VueJS dropdown menu component. 28/01/2025. DEV Community 2016-2025. (online) [Accessed 13/05/2025] URL: https://dev.to/mmmrks/building-a-vuejs-dropdown-menu-component-ho3 -->