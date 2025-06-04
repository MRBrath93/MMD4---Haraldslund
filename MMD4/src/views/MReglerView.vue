<script setup>
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import TheInternNavHaraldslund from "@/components/TheInternNavHaraldslund.vue";
import TheHero from "@/components/TheHero.vue";
import Reklamekort from "@/components/Reklamekort.vue";
import DynamicHeading from "@/components/DynamicHeading.vue";
import TheSpinner from "@/components/TheSpinner.vue";

import { ref, onMounted } from "vue";

// CACHE VARIABLER
const CACHE_DURATION_MS = 60 * 60 * 1000;

onMounted(() => {
  isLoading.value = true;
  error.value = null;

  const cachedMotionReglerRaw = localStorage.getItem('motionRegler');
  const cachedTimestampRaw = localStorage.getItem('cacheMReglerTimestamp');
  const now = Date.now();

  if (cachedMotionReglerRaw && cachedTimestampRaw) {
    const cachedTimestamp = Number(cachedTimestampRaw);

    if (now - cachedTimestamp < CACHE_DURATION_MS) {
      try {
        mReglerData.value = JSON.parse(cachedMotionReglerRaw);
        isLoading.value = false;
        return;
      } catch (e) {
        console.warn('Fejl ved parsing af cached data:', e);
      }
    }
  }

  fetch('https://popular-gift-b355856076.strapiapp.com/api/regler-motionscenter?pLevel')
  .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP fejl! Status: ${response.status}`);
      }
      return response.json();
    })    
    .then(data => {
        mReglerData.value = data.data;
        localStorage.setItem('motionRegler', JSON.stringify(mReglerData.value));
        localStorage.setItem('cacheMReglerTimestamp', now.toString()); 
    })
    .catch(err => {
      error.value = err.message;
    })
    .finally(() => {
      isLoading.value = false;
    });
});


const internNavLabels = [
  { id: 1, label: "Om Motionscenteret", name: "om-motionscenteret" },
  { id: 2, label: "Holdoversigt", name: "holdoversigt-motionscenteret" },
  { id: 3, label: "Priser", name: "priser-motionscenteret" },
  { id: 4, label: "Regler", name: "regler-motionscenteret" },
  { id: 5, label: "Personlig træning", name: "personlig-traening-motionscenteret" },
  { id: 6, label: "Leje af sal & instruktør", name: "leje-af-sal-og-instruktor-motionscenteret" },
  { id: 7, label: "Sundhed i bevægelse", name: "sib-motionscenteret" },
];

const mReglerData = ref(null);
const isLoading = ref(true);
const error = ref(null);

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
    <div class="loading-container" v-if="isLoading">        
        <TheSpinner>
            <span class="material-icons">sports_gymnastics</span>
        </TheSpinner>
    </div>
    <div v-else-if="error">Der opstod en fejl: {{ error }}</div>
    <div class="first-wrapper" v-else>
        <TheHero
        :title="mReglerData.Hero_sektion.Hero_titel_h5?.Titel_H5"
        :subtitle="mReglerData.Hero_sektion.Hero_undertitel_h6?.Undertitel_H6"
        description="Læs om regler og retningslinjer for Haraldslunds motionscenter."
        :image="mReglerData.Hero_sektion?.Hero_Baggrundsbillede?.Billede[0].url"
        :alt="mReglerData.Hero_sektion.Hero_Baggrundsbillede?.data?.attributes?.alternativeText || 'Hero billede'"></TheHero>

        <div class="wrapper">
          <TheBreadcrumb></TheBreadcrumb>  
        </div>

        <TheInternNavHaraldslund :label="internNavLabels"></TheInternNavHaraldslund>
        <div class="container-rules">
            <section v-for="(afsnit,index) in mReglerData.Indhold?.Afsnit || []" :key="afsnit.id" >
                <DynamicHeading :level="index === 0 ? 1 : 2">{{ afsnit.Overskrift }}</DynamicHeading>
                <div class="text-spacer" v-for="tekstafsnit in afsnit.Tekst || []" :key="tekstafsnit.id">
                    <h4 v-if="tekstafsnit.Underoverskift">{{ tekstafsnit.Underoverskift }}</h4>
                    <p>{{ tekstafsnit.Brodtekst }}</p>
                </div>
            </section>
            <Reklamekort 
                :src="getImage(mReglerData?.reklame_kort?.Billede) || '' " 
                :alt="mReglerData.reklame_kort.Billede.alternativeText" 
                :title="mReglerData.reklame_kort.Titel" 
                :text="mReglerData.reklame_kort.Tekst_afsnit" 
                :Btn_title="mReglerData.reklame_kort.Knapper[0].btn_titel" 
                :Btn_text="mReglerData.reklame_kort.Knapper[0].btn_description" 
                :kategori="mReglerData.reklame_kort.Kategori" 
                :Btn_icon="mReglerData.reklame_kort.Knapper[0].Ikon[0]">
            </Reklamekort>
            <!-- REFERENCE BILLEDE: 232319. billede: #37584142 (online). Colourbox.dk 2025. [Accessed 07/05/2025]. URL: https://www.colourbox.dk/billede/traening-gammeldags-personlig-billede-37584142   -->
        </div>
    </div>
</template>

<style scoped>

.wrapper {
  width: 95%;
  margin: 0 auto;
}

.loading-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container-rules {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--spacer-x2);
    max-width: var(--max-width);
    margin: 0 auto;
    width: 95%;
}

h4 {
    padding-top: var(--spacer-x0-5);
}

p {
    padding-bottom: var(--spacer-x1);
}


</style>