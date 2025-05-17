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
    <component :is="tag" class="dynamic-heading">
      <slot />
    </component>
  </template>

  <style scoped>
  .dynamic-heading {
    font-family: var(--font-heading);
  }
  </style>
  