<script setup>
import { defineProps, ref, onMounted } from 'vue';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const scrollContainer = ref(null);
const showLeftArrow = ref(false);
const showRightArrow = ref(true);

const handleScroll = () => {
  const el = scrollContainer.value;
  showLeftArrow.value = el.scrollLeft > 10;
  showRightArrow.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 10;
};

onMounted(() => {
  handleScroll();
});
</script>

<template>
  <div class="wrapper">
    <div class="flex-row-container"> 
      <i class="material-symbols-rounded" aria-hidden="true">filter_alt</i>
      <p id="filter-headline"><strong>Filtrér efter kategori:</strong></p>
    </div>
    <div class="category-wrapper" :class="{ 'show-left-fade': showLeftArrow, 'show-right-fade': showRightArrow }">
  <i v-if="showLeftArrow" class="scroll-hint left material-symbols-rounded" aria-hidden="true">arrow_back_ios</i>

  <div
    ref="scrollContainer"
    class="category-buttons"
    @scroll="handleScroll"
  >
    <button
      v-for="category in store.availableCategories"
      :key="category"
      @click="store.setCategory(category)"
      :class="{ active: store.selectedCategory === category }"
    >
      {{ category }}
    </button>
  </div>

  <i v-if="showRightArrow" class="scroll-hint right material-symbols-rounded" aria-hidden="true">arrow_forward_ios</i>
</div>
  </div>
</template>
  

  <style scoped>
.category-wrapper {
  position: relative;
}

i{
  color: var(--color-font-1);
}

.category-wrapper::before {
  content: "";
  position: absolute;
  left: -10px;
  top: 0;
  width: 10rem;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(to right, var(--color-body-background), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-wrapper::after {
  content: "";
  position: absolute;
  right: -10px;
  top: 0;
  width: 10rem;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(to left, var(--color-body-background), transparent);
}

.category-wrapper.show-left-fade::before {
  opacity: 1;
}

.category-wrapper.show-right-fade::after {
  opacity: 1;
}

.category-wrapper::before,
.category-wrapper::after {
  opacity: 0;
  transition: opacity 0.3s ease;
}

  .wrapper{
    width: 100%;
    max-width: var(--max-width);
    margin: 0 auto;
  }

  .category-buttons {
  display: flex;
  gap: var(--spacer-x1);
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 0.5rem;
}
  
  button {
    padding: var(--spacer-x0-5) var(--spacer-x1);
    border: none;
    cursor: pointer;
    font-family: var(--font-text);
    font-size: var(--spacer-x1);
    font-weight: 700;
    background-color: var(--color-btn-primary);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    border-radius: var(--border-radius);
    white-space: nowrap;
    flex: 0 0 auto;
    color: var(--color-font-1);
  }

  button.active, button:hover {
    text-decoration: underline;
    text-underline-offset: 5px;
    font-weight: bold;
    background-color: var(--color-btn-primary-hover);
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

  .scroll-hint {
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
  font-size: 1.6rem;
  color: var(--color-navigation);
  animation: bounce 1s infinite;
  pointer-events: none;
  z-index: 40;
}

.scroll-hint.left {
  left: 0.5rem;
  animation-name: bounce-outward-left;
}

.scroll-hint.right {
  right: 0.5rem;
  animation-name: bounce-outward-right;
}

  @keyframes bounce-outward-left {
  0%, 100% { transform: translateY(-50%) translateX(0); }
  50% { transform: translateY(-50%) translateX(-5px); }
}

@keyframes bounce-outward-right {
  0%, 100% { transform: translateY(-50%) translateX(0); }
  50% { transform: translateY(-50%) translateX(5px); }
}

.category-buttons::-webkit-scrollbar {
    display: none; /* Chrome */
  }

  .category-buttons{
    scrollbar-width: none;
  }

  

  @media screen and (max-width: 600px) {
  

  .flex-row-container h5 {
    font-size: 1rem;
  }

  .category-buttons {
    justify-content: flex-start;
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
  }

  .category-buttons::-webkit-scrollbar {
    display: none; /* Chrome */
  }

}

@media (min-width: 1300px) {
  .scroll-hint {
    display: none;
  }
}


  </style>
<!-- INSPIRATIONSKILDER:   
 Getters: Eduardo San Martin Morote. Pinia - Core Concepts- Getters. (online) Pinia Vue.Js. 2019. [Accessed 16/05/2025] URL: https://pinia.vuejs.org/core-concepts/getters.html
 Computed Properties: Evan You. Essentials - Computed Properties. (online) Vue.js. 2014-2025[Accessed 16/05/2025] URL: https://vuejs.org/guide/essentials/computed
-->