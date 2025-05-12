<script setup>

const props = defineProps({
  labels: {
    type: Array,
    required: true,
  },
  separator: {
    type: String,
    default: " / ",
  },
});
</script>

<template>
  <section>
    <ul class="breadcrumb-list">
      <li v-for="(item, index) in labels" :key="index" 
      :class="{ fat: index === labels.length - 1 }">
        <router-link :to="{ name: item.name }">
          <span class="small">{{ item.label }}</span>
        </router-link>
        <span v-if="index < labels.length - 1">{{ separator }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.breadcrumb-list {
  display: flex;
  padding: 0;
}
.breadcrumb-list li {
  list-style: none;
  color: var(--color-font-1);
  margin-right: 0.5rem;
}

.fat {
  font-weight: bold;
  color: var(--color-accent, #f00); 
}
</style>

<!-- INSPIRATIONSKILDE: Atakan COSKUNDERE. Vue.js Dynamic Breadcrumb. Published 07/09/2020 Istanbul. (online) [Accessed 12/05/25] URL:https://www.youtube.com/watch?v=yL2z3oUr-So -->
<!-- INSPIRATIONSKILDE: Evan You, Eduardo San Martin Morote. Vue Router. 2014. (online) [Accessed 12/05/2025] URL: https://router.vuejs.org/guide/essentials/navigation.html#Programmatic-Navigation -->
