<script setup>
import { ref, onMounted } from 'vue';

const events = ref([]);

const fetchEvents = () => {
  fetch('https://popular-gift-b355856076.strapiapp.com/api/eventlistes?pLevel')
    .then((response) => response.json())
    .then((data) => {
      events.value = data.data;
    })
    .catch((error) => {
      console.error('Fejl ved hentning af events:', error);
    });
};

onMounted(() => {
  fetchEvents();
});

function getImage(billede) {
  if (!billede || !billede.formats) return '';
  return billede.formats.medium?.url ||
    billede.formats.small?.url ||
    billede.formats.thumbnail?.url ||
    billede.url || '';
}
</script>

<template>
  <section href="#" class="events-card">
    <h3>Events i denne måned</h3>
      <div class="flex">
        <a href="#" class="container" v-for="event in events" :key="event.id">
            <img class="image" :src="getImage(event.Cover)" :alt="event.Cover.alternativeText">
            <div class="label-container">
                <p>Læs mere</p>
                <span class="material-symbols-rounded">arrow_forward</span>
            </div>
        </a>
    </div>
</section>
</template>

<style scoped>
.events-card {
  width: 100%;
  max-width: var(--max-width);
}

.container {
  position: relative;
  width: 100%;
  height: 30vh;
  transition: box-shadow 0.4s ease, transform 0.4s ease;
  border-radius: var(--border-radius);
}

.container:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  transform: translateY(-4px);
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  border-radius: var(--border-radius);
}

.label-container {
  position: absolute;
  bottom: 0;
  text-align: center;
  width: 100%;
  background-color: var(--color-navigation);
  color: var(--color-font-2);
  font-family: var(--font-heading);
  padding: var(--spacer-x0-5) var(--spacer-x1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}

.label-container p {
  color: var(--color-font-2);
}

h3 {
  text-align: center;
}

.flex {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacer-x2);
  width: 95%;
  max-width: var(--max-width);
  margin: 0 auto;
  justify-content: center;
}

@media screen and (min-width: 600px) {
  .flex {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (min-width: 800px) {
  .flex {
    grid-template-columns: repeat(3, minmax(0, 300px));
  }

  .container {
    height: auto;
    aspect-ratio: 1 / 1;
    max-width: 300px;
  }

  .container:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  transform: translateY(-4px);
}
}
</style>
