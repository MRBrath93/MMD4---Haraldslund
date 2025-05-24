<script setup>
import { computed } from 'vue';

// Props
const props = defineProps({
  level: {
    type: Number,
    default: 2,
    validator: (val) => val >= 1 && val <= 6
  }
});

// Dynamisk tag baseret på level
const tag = computed(() => `h${props.level}`);
</script>


<template>
    <component :is="tag" class="dynamic-heading" id="main" tabindex="-1">
      <slot />
    </component>
  </template>

  <!-- ACCESSABILITY NOTE: SKIP-LINK FUNKTION: id="main" bruges til at kunne fokusere på hovedindholdet ved brug af "Skiplink"
    tabindex="-1" gør main fokuserbart ved keyboard-nav -->

  <style scoped>
  .dynamic-heading {
    font-family: var(--font-heading);
  }
  </style>
  