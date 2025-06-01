<script setup>
// --- IMPORTS ---
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { defineProps } from 'vue';

// --- IMPORTS TIL ROUTER ---
const props = defineProps({
  label: Array
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
  <!-- -- KNAP TIL AT ÅBNE OG LUKKE DROPDOWN-MENUEN -- -->
      <button 
      @click="isOpen = !isOpen" 
      class="dropdown-toggle" 
      label="Tryk for at åbne den interne navigation for siden"
      :aria-expanded="isOpen.toString()"
      aria-haspopup="true"
      :aria-controls="'intern-nav-menu'"
      aria-label="Åbn eller luk intern navigation"
      type="button"
      > 
      <span class="button-label">Indhold:</span><span id="button-selected"> {{ selectedLabel || "Vælg side" }}</span>
          <i class="material-symbols-rounded" aria-hidden="true">
              {{ isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
          </i>
      </button>
  <!-- -- MENU -- -->
      <ul 
      class="small intern-nav-container dropdown" 
      v-show="isOpen"
      role="menu"
      id="intern-nav-menu"
      tabindex="0"
      >
          <li v-for="(item, index) in label" :key="index">
              <router-link 
              :to="{ name: item.name }" 
              @click="selectItem(item)"
              role="menuitem"
              :aria-current="$route.name === item.name ? 'page' : null"
              class="menu-item"
              :aria-label="`Gå til ${item.label}`"
              >
                <span>{{ item.label }}</span>
              </router-link>
          </li>
      </ul>
  </section>
</template>

<!-- INSPIRATIONSKILDE ARIA: Schroiff, Florian. Practical Guide on Implementing ‘aria-expanded’ in Web Development. 11/07/2024. (online) A11Y collective 2025. Level Level. [Accessed 29/05/2025] URL: https://www.a11y-collective.com/blog/aria-expanded/ -->
  
<style scoped>

.intern-nav {
    margin: 0 var(--mobile-site-space);
    background: var(--color-btn-primary);
    position: absolute;
    z-index: 2;
    width: 80%;
  }
  
.dropdown-toggle {
    background: var(--color-btn-primary);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 100%;
    padding: var(--spacer-x1);
    margin-bottom: var(--spacer-x0-5);
    color: var(--color-font-1);
  }

.intern-nav-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-x1);
    padding: var(--spacer-x0-5) var(--spacer-x1);
    color: var(--color-font-1);
    width: 100%;
    max-width: var(--max-width);
}
  
li {
    list-style-type: none;
}
  
span {
    font-size: clamp(0.875rem, 1.5vw, 1rem);
    color: var(--color-font-1);
}
    
.button-label {
    font-weight: bold;
    padding-right: var(--spacer-x0-25);
    font-family: var(--font-heading);

}

.button-selected {
    font-weight: 500;
    font-family: var(--font-heading);
}

button{
  color: var(--color-font-1);
}

.menu-item {
  padding: var(--spacer-x0-5) var(--spacer-x1) var(--spacer-x0-5) 0;
  min-width: 1.5rem;
  min-height: 1.5rem;
}



@media screen and (min-width: 1300px) {
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
    gap: var(--spacer-x1);
}

.menu-item  {
    display: flex;
    width: max-content;
}
  
.intern-nav {
    align-items: center;
    width: 100%;
    gap: var(--spacer-x3);
    background-color: var(--color-body-background);
    margin: 0 auto var(--spacer-Elements);
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

.breadcrumb {
  margin: 0;
}
}

</style> 
<!-- INSPIRATIONSKILDER: SE REFERENCER TIL KODE I FILEN "src/components/TheInternNavMotion.vue" -->
