<script setup>
// IMPORTS 
import { ref, onMounted } from "vue";
import TheInternNavHaraldslund from "../components/TheInternNavHaraldslund.vue";
import TheBreadcrumb from "../components/TheBreadcrumb.vue";
import TheHero from "../components/TheHero.vue";
import TheSpinner from "../components/TheSpinner.vue";
import RushHoursHaraldslund from '@/components/RushHoursHaraldslund.vue';


// Intern navigation labels (fra Strapi)
const internNavLabels = [
{ id: 1, label: "Praktisk Information", name: "haraldslund-praktisk-info" },
{ id: 2, label: "Prisoversigt", name: "haraldslund-priser" },
{ id: 3, label: "Café Harald", name: "haraldslund-cafe" },
{ id: 4, label: "Personale", name: "haraldslund-personale" },
{ id: 5, label: "Historien", name: "haraldslund-historie" },
{ id: 6, label: "Bibliotek", name: "haraldslund-bibliotek" },
{ id: 7, label: "Firmaaftaler", name: "haraldslund-firmaaftaler" },
{ id: 8, label: "Brugerråd", name: "haraldslund-brugerraad" },
{ id: 9, label: "Events", name: "haraldslund-events" },
{ id: 10, label: "Aktivitetsoversigt", name: "haraldslund-aktivitetsoversigt" },
];


// REAKTIVE VARIABLER
const aboutData = ref([]);
const isLoading = ref(true);
const error = ref(null);

// CACHE VARIABLER
const CACHE_DURATION_MS = 1 * 60 * 1000;

// FETCH DATA
// Henter data fra Strapi API og cacher det i localStorage
onMounted(() => {
  isLoading.value = true;
  error.value = null;

  const cachedaboutRaw = localStorage.getItem('aboutData');
  const cachedTimestampRaw = localStorage.getItem('cacheharaldslundTimestamp');
  const now = Date.now();

  if (cachedaboutRaw && cachedTimestampRaw) {
    const cachedTimestamp = Number(cachedTimestampRaw);

    if (now - cachedTimestamp < CACHE_DURATION_MS) {
      try {
        aboutData.value = JSON.parse(cachedaboutRaw);
        isLoading.value = false;
        return;
      } catch (e) {
        console.warn('Fejl ved parsing af cached data:', e);
      }
    }
  }

  fetch('https://popular-gift-b355856076.strapiapp.com/api/om-haraldslund?pLevel')
    .then(response => {
      if (!response.ok) {
        throw new Error(`About fejl: ${response.status}`);
      }
      return response.json();
    })
    .then(json => {
      aboutData.value = json.data;
      localStorage.setItem('aboutData', JSON.stringify(aboutData.value));
      localStorage.setItem('cacheTimestamp', now.toString());
    })
    .catch(err => {
      error.value = err.message;
    })
    .finally(() => {
      isLoading.value = false;
    });
});

// FUNKTIONER

function getImage(billede) {
    if (!billede || !billede.formats) return '';
    return billede.formats.large?.url ||
        billede.formats.medium?.url ||
        billede.formats.small?.url ||
        billede.formats.thumbnail?.url ||
        billede.url || '';
}


</script>
<template>
    <div v-if="isLoading">        
        <TheSpinner>
            <span class="material-icons">sports_gymnastics</span>
        </TheSpinner>
    </div>
    <div v-else-if="error">Der opstod en fejl: {{ error }}</div>
    <div v-else>        
        <TheHero
        :title="aboutData.Hero_sektion.Hero_titel_h5.Titel_H5"
        :subtitle="aboutData.Hero_sektion.Hero_undertitel_h6.Undertitel_H6"
        :image="aboutData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].url"
        :alt="aboutData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].alternativeText"></TheHero>
        <TheBreadcrumb></TheBreadcrumb>
        <TheInternNavHaraldslund
        :label="internNavLabels"></TheInternNavHaraldslund>
        <section>
            <h1> Aktivitetsoversigt </h1>
            <RushHoursHaraldslund></RushHoursHaraldslund>
        </section>
    </div>

</template>
<style scoped>
section{
    width: 95%;
    max-width: var(--max-width);
    margin: 0 auto;
    text-align: center;
}
</style>