<script setup>
// --- IMPORTS ---
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { defineProps } from 'vue';

// --- IMPORTS TIL ROUTER ---
const props = defineProps({
  label: {
    type: Array,
    default: () => [
      { id: 1, label: "Praktisk Information", name: "haraldslund-praktisk-info" },
      { id: 2, label: "Prisoversigt", name: "haraldslund-priser" },
      { id: 3, label: "Café Harald", name: "haraldslund-cafe" },
      { id: 4, label: "Personale", name: "haraldslund-personale" },
      { id: 5, label: "Historien", name: "haraldslund-historie" },
      { id: 6, label: "Bibliotek", name: "haraldslund-bibliotek" },
      { id: 7, label: "Firmaaftaler", name: "haraldslund-firmaaftaler" },
      { id: 8, label: "Brugerråd", name: "haraldslund-brugerraad" },

    ],
  },
});

// --- VARIABLER ---
// Variabler til dropdown-menuen
const isOpen = ref(false);
const selectedLabel = ref(null);
const dropdownRef = ref(null);


// --- FUNKTIONER ---

// ÅBNE OG LUKKE DROPDOWN-MENU PÅ SMÅ SKÆRME
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

// KLIK PÅ DROPDOWN-MENU
const selectItem = (item) => {
  selectedLabel.value = item.label;
  isOpen.value = false; 
};

// LIFECYCLE HOOKS
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});


</script>


<template>
  <section 
  class="intern-nav" 
  ref="dropdownRef" 
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
</template>
  
<style scoped>

.intern-nav {
    margin: 0 auto var(--spacer-x1);
    width: 100vw;
    background: var(--color-btn-primary);
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
}
</style> 
<!-- INSPIRATIONSKILDER: SE REFERENCER TIL KODE I FILEN "src/components/TheInternNavMotion.vue" -->
