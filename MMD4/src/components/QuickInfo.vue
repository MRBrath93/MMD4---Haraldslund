<script setup>
import { computed } from 'vue';
const props = defineProps({
  time: Number,
  group: String,
  type_af_hold: String,
  priser: Array,
  praticalInfo: Array,
  cancelBooking: String,
});

const backgroundClass = computed(() => {
  switch (props.type_af_hold) {
    case 'Om Haraldslund':
      return 'bg-haraldslund';
    case 'Møder & Konferencer':
      return 'bg-meeting';
    case 'Wellness':
      return 'bg-wellness';
    case 'Motion':
      return 'bg-motion';
    case 'Svømning':
      return 'bg-svommehal';
    default:
      return 'bg-default';
  }
  
});
</script>

<template>
    <div :class="['wrapper', backgroundClass]">
      <h3>Det hurtige overblik</h3>
  
      <div v-if="group">
        <p class="bold">Målgruppe:</p>
        <p>{{ group }}</p>
      </div>
      <div v-if="time">
        <p class="bold">Varighed:</p>
        <p>{{ time }} minutter</p>
      </div>
      <div v-if="priser.length > 0">
        <p class="bold">Pris:</p>
        <div class="flexrow" v-for="pris in priser" :key="pris.id">
          <p>{{ pris.Genstand }}:</p>
          <p>{{ pris.Pris }},-</p>
        </div>
      </div>
      <div v-if="praticalInfo.length > 0">
        <p class="bold">Det praktiske:</p>
        <ul>
          <li v-for=" info in praticalInfo" :key="info.id">{{ info.Oplysning }}</li>
        </ul>
      </div>
      <div v-if="cancelBooking">
        <p class="bold">Aflysning:</p>
        <p>{{ cancelBooking }}</p>
      </div>
    </div>
  </template>
  

<style scoped>

.flexrow{
  display: flex;
  gap: var(--spacer-x1);
}

.wrapper {
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: 100%;
  color: var(--color-font-1);
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

ul>li{
  font-family: var(--font-text);
}

ul{
  display: flex;
  flex-direction: column;
  gap: var(--spacer-x0-5);
}


@media screen and (max-width: 700px) {
    .wrapper{
        padding: 1rem;
    }
}
</style>