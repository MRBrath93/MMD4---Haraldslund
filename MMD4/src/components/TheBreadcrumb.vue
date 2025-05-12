<script setup>
import { useRoute } from "vue-router";

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
  <section class="breadcrumb-container">
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
.breadcrumb-container {
  display: flex;
}
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
  color: var(--color-accent, #f00); /* Eksempel på farve */
}

</style>
