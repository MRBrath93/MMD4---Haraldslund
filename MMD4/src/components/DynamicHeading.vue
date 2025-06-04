<script setup>
// Importerer computed fra Vue til at lave beregnede værdier
import { computed } from 'vue';

// Definerer props til komponenten
const props = defineProps({
  // 'level' er et tal, der bestemmer overskriftsniveauet (h1 til h6)
  level: {
    type: Number,
    default: 2, // Standardværdi er h2, hvis ikke andet gives
    // Validator sikrer at level er mellem 1 og 6 (gyldigt for HTML-overskrifter)
    validator: (val) => val >= 1 && val <= 6
  }
});

// Computed property til dynamisk at generere tag-navnet ud fra level-proppen
// F.eks. hvis level=3, bliver tag 'h3'
const tag = computed(() => `h${props.level}`);
</script>

<template>
  <!-- 
    Dynamisk komponent der rendrer et HTML-tag baseret på 'tag' værdien,
    altså et h1, h2, h3 osv. efter det valgte niveau. 
    Klassen 'dynamic-heading' bruges til styling.
    id="main" og tabindex="-1" tilgodeser tilgængelighed ved skip-link funktion.
  -->
  
  <component :is="tag" class="dynamic-heading" tabindex="-1"
     v-bind="props.level === 1 ? { id: 'page-title', tabindex: -1 } : {}" >
      <slot />
    </component>
</template>

<!-- 
  Accessibility note:
  SKIP-LINK FUNKTION: id="main" bruges til at kunne fokusere på hovedindholdet ved brug af "Skiplink"
    tabindex="-1" gør main fokuserbart ved keyboard-nav-->

<style scoped>
.dynamic-heading {
  font-family: var(--font-heading);
}
</style>


  