<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="wrapper">
    <div class="flex-row-container"> 
      <i class="material-symbols-rounded">filter_alt</i>
      <h5>Filtrér efter kategori:</h5>
    </div>
    <div class="category-buttons">
      <button
        v-for="category in store.availableCategories"
        :key="category"
        @click="store.setCategory(category)"
        :class="{ active: store.selectedCategory === category }"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>
  

  <style scoped>
  .wrapper{
    width: 95%;
    max-width: var(--max-width);
    margin: 0 auto;

  }

  .category-buttons {
    display: flex;
    gap: var(--spacer-x1);
  }
  
  button {
    padding: var(--spacer-x0-5) var(--spacer-x1);
    border: none;
    cursor: pointer;
    font-family: var(--font-text);
    font-size: 1rem;
    font-weight: 700;
    background-color: var(--color-btn-primary);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    border-radius: var(--border-radius);
  }
  
  button.active, button:hover {
    text-decoration: underline;
    text-underline-offset: 5px;
    font-weight: bold;
    background-color: var(--color-navigation);
    color: var(--color-font-2);
  }

  ul {
    list-style: none;
    padding: 0;
  }

  .flex-row-container {
    display: flex;
    align-items: center;
    gap: var(--spacer-x0-5);
    width: 100%;

  }

  </style>
<!-- INSPIRATIONSKILDER:   
 Getters: Eduardo San Martin Morote. Pinia - Core Concepts- Getters. (online) Pinia Vue.Js. 2019. [Accessed 16/05/2025] URL: https://pinia.vuejs.org/core-concepts/getters.html
 Computed Properties: Evan You. Essentials - Computed Properties. (online) Vue.js. 2014-2025[Accessed 16/05/2025] URL: https://vuejs.org/guide/essentials/computed
-->