<script setup>
// --- IMPORTS ---
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { defineProps } from 'vue';

// --- IMPORTS TIL ROUTER ---
const props = defineProps({
  label: {
    type: Array,
    default: () => [
      { id: 1, label: "Svømmehallen", name: "svommehallen-vandogwellness" },
      { id: 2, label: "Wellness", name: "wellness-vandogwellness" },
      { id: 3, label: "Holdoversigt", name: "holdoversigt-vandogwellness" },
      { id: 4, label: "Priser", name: "priser-vandogwellness" },
      { id: 5, label: "Regler", name: "regler-vandogwellness" },
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
    // window.addEventListener("scroll", handleScroll);
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    // window.removeEventListener("scroll", handleScroll);
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
      label="Tryk for at åbne den interne navigation for siden"
      > 
      <span class="button-label">Indhold:</span> {{ selectedLabel || "Vælg side" }}
          <i class="material-symbols-rounded" aria-hidden="true">
              {{ isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
          </i>
      </button>
      <ul 
      class="small intern-nav-container dropdown" 
      v-show="isOpen"
      id="intern-nav-menu"
      tabindex="0"
      role="menu"
      >
          <li v-for="(item, index) in label" :key="index">
              <router-link 
              :to="{ name: item.name }" 
              @click="selectItem(item)"
              role="menuitem"
              :aria-current="$route.name === item.name ? 'page' : null"
              class="menu-item"
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
    color: var(--color-font-1);
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

.menu-item {
  padding: var(--spacer-x0-5) var(--spacer-x1);
  min-width: 1.5rem;
  min-height: 1.5rem;
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
