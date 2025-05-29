<script setup>
import { computed } from 'vue';
import TheBtn from './TheBtn.vue';
const props = defineProps({
  title: String,
  text: String,
  btn_title: String,
  btn_text: String,
  btn_path: String,
  btn_target: String,
  btn_icon: String,
  type_af_hold: String,
});

const backgroundClass = computed(() => {
  switch (props.type_af_hold) {
    case 'Om Haraldslund':
    case 'Historien':
    case 'Praktisk information':
    case 'Cafe':
    case 'Bibliotek':
    case 'Brugerråd':
    case 'Booking':
    case 'Personale':
    case 'Cafe':
    case 'Firmaaftaler':
    case 'Samlet priser':
      return 'bg-haraldslund';
    case 'Møder & Konferencer':
      return 'bg-meeting';
    case 'Wellness':
      return 'bg-wellness';
    case 'Motion hold':
    case 'Motion':
    case 'Leje af sal og instruktør':
    case 'Om motionscenteret':
    case 'Personlig træning':
    case 'Motion priser':
    case 'Motion regler':
    case 'Sundhed i bevægelse':
      return 'bg-motion';
    case 'Svømmehal':
    case 'Svømning':
    case 'Vand og wellness':
    case 'VW hold':
    case 'VW priser':
    case 'VW regler':
      return 'bg-svommehal';
    default:
      return 'bg-default';
  }
});
</script>

<template>
    <article :class="['bookingSquare', backgroundClass]">
      <h4>{{ title }}</h4>
      <div>
        <p>{{ text }}</p>
      </div>
      <TheBtn :title="btn_title" :text="btn_text" :link="btn_path" :target="btn_target" :icon="btn_icon"></TheBtn>
    </article>
  </template>
  

<style scoped>
.bookingSquare {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 1rem 2rem;
    color: var(--color-font-1);
}

.bookingSquare h4, .bookingSquare p {
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
  background-color: var(--color-haraldslund-light);
}


@media screen and (max-width: 700px) {
    .bookingSquare{
        padding: 1rem;
    }
}
</style>