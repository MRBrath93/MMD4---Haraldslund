<script setup>
import { computed } from 'vue';
const props = defineProps({
  time: String,
  pris: String,
  praticalInfo: String,
  cancelBooking: String,
  kategori: String,
});

const backgroundClass = computed(() => {
  switch (props.kategori) {
    case 'Om Haraldslund':
      return 'bg-haraldslund';
    case 'Møder & Konferencer':
      return 'bg-meeting';
    case 'Wellness':
      return 'bg-wellness';
    case 'Motion':
      return 'bg-motion';
    case 'Svømmehal':
      return 'bg-svommehal';
    default:
      return 'bg-default';
  }
});
</script>

<template>
    <div :class="['wrapper', backgroundClass]">
      <h2>Det hurtige overblik</h2>
  
      <div v-if="time">
        <p class="bold">Varighed:</p>
        <p>{{ time }}</p>
      </div>
      <div v-if="pris">
        <p class="bold">Pris:</p>
        <p>{{ pris }}</p>
      </div>
      <div v-if="praticalInfo">
        <p class="bold">Det praktiske:</p>
        <p>{{ praticalInfo }}</p>
      </div>
      <div v-if="cancelBooking">
        <p class="bold">Aflysning:</p>
        <p>{{ cancelBooking }}</p>
      </div>
    </div>
  </template>
  

<style scoped>
.wrapper {
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: 100%;
}

.bg-haraldslund {
  background-color: var(--color-haraldslund-light);
}

.bg-meeting {
  background-color: var(--color-meetings-light);
}

.bg-motion {
  background-color: var(--color-motion-light);
}

.bg-svommehal {
  background-color: var(--color-svim-light);
}

.bg-wellness {
  background-color: var(--color-wellness-light);
}

.bg-default {
  background-color: #eecdad;
}

.bold{
    font-weight: bold;
}

@media screen and (max-width: 700px) {
    .wrapper{
        padding: 1rem;
    }
}
</style>