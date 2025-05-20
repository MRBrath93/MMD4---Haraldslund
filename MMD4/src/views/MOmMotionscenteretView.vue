<script setup>
// IMPORTS
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import TheInternNavMotion from "../components/TheInternNavMotion.vue";
import TheHero from "@/components/TheHero.vue";
import ImageHolder from "@/components/ImageHolder.vue";
import Reklamekort from "@/components/Reklamekort.vue";
import TheSpinner from "@/components/TheSpinner.vue";

import { ref, onMounted } from "vue";


// REAKTIVE VARIABLER
const motionData = ref(null);
const isLoading = ref(true);
const error = ref(null);

// CACHE VARIABLER
const CACHE_DURATION_MS = 5 * 60 * 1000;

// FETCH DATA FRA LOCAL STORAGE 
onMounted(() => {
  isLoading.value = true;
  error.value = null;
  const cachedMotionRaw = localStorage.getItem('motionData'); // Hent cached data
  const cachedTimestampRaw = localStorage.getItem('cacheTimestamp'); // Hent cached timestamp
  const now = Date.now();   // CACHE VARIABLER
  // CHECK CACHE
  if (cachedMotionRaw && cachedTimestampRaw) {
    const cachedTimestamp = Number(cachedTimestampRaw);
    if (now - cachedTimestamp < CACHE_DURATION_MS) {
      try {
        motionData.value = JSON.parse(cachedMotionRaw);
        isLoading.value = false;
        return;
      } catch (e) {
        console.warn('Fejl ved parsing af cached data:', e);
      }
    }
  }
  // FETCH DATA FRA STRAPI
  fetch('https://popular-gift-b355856076.strapiapp.com/api/motionscenter?pLevel')
  .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP fejl! Status: ${response.status}`);
      }
      return response.json();
    })    
    .then(json => {
        motionData.value = json.data;
        localStorage.setItem('motionData', JSON.stringify(motionData.value));
        localStorage.setItem('cacheTimestamp', now.toString());
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
  { id: 7, label: "Sundhed & bevægelse", name: "sib-motionscenteret" },
];

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
    <main v-if="isLoading">        
      <TheSpinner>
            <span class="material-icons">sports_gymnastics</span>
        </TheSpinner>
      </main>
    <main v-else-if="error">Der opstod en fejl: {{ error }}</main>
    <main v-else>
      <TheHero
        :title="motionData.Hero_sektion.Hero_titel_h5?.Titel_H5"
        :subtitle="motionData.Hero_sektion.Hero_undertitel_h6?.Undertitel_H6"
        description="Læs om vores moderne motionscenter."
        :image="getImage(motionData.Hero_sektion?.Hero_Baggrundsbillede?.Billede[0])"
        :alt="motionData.Hero_sektion.Hero_Baggrundsbillede?.data?.attributes?.alternativeText || 'Hero billede'" />
  
      <TheBreadcrumb />  
  
      <TheInternNavMotion 
      :labels="internNavLabels" />
      <h1>{{ motionData.Titel }}</h1>
      <section v-for="afsnit in motionData.Indhold.Afsnit || []" :key="afsnit.id">
        <h2>{{ afsnit.Overskrift }}</h2>
          <div class="flex-column-container">
            <div v-for="tekst in afsnit.Tekst || []" :key="tekst.id">
                <p class="fat-text" v-if="tekst.Underoverskift" :key="tekst.id"> 
                  {{ tekst.Underoverskift }}</p>
                <p>{{ tekst.Brodtekst }}</p>
            </div>
          </div>
    
          <article>
            <div class="gallery-grid">
              <ImageHolder
                 v-for="billede in afsnit.Billede"
                :key="billede.id"
                class="gallery-img"
                :src="getImage(billede)"
                :alt="billede?.data?.attributes?.alternativeText || 'Billede'" />
              </div>
            </article>
            
          </section>
        <aside class="containerB" v-if="motionData.Billeder?.length > 0">
          <ImageHolder
          v-for="billede in motionData.Billeder"
          :key="billede?.id"
          class="side-img"
          :src="getImage(billede)"
          :alt="billede?.data?.attributes?.alternativeText || 'Billede'" />
        </aside>


        <Reklamekort 
          :src="getImage(motionData.reklame_kort.Billede) || '' " 
          :alt="motionData.reklame_kort.Billede.alternativeText" 
          :title="motionData.reklame_kort.Titel" 
          :text="motionData.reklame_kort.Tekst_afsnit" 
          :Btn_title="motionData.reklame_kort.Knapper[0].btn_titel" 
          :Btn_text="motionData.reklame_kort.Knapper[0].btn_description" 
          :kategori="motionData.reklame_kort.Kategori" 
          :Btn_icon="motionData.reklame_kort.Knapper[0].Ikon[0]">
        </Reklamekort>
    </main>
  </template>
  

<style scoped>

.containerB {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--spacer-x2);
    max-width: 800px;
}


main{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}


.flex-column-container{
    display: flex;
    flex-direction: column;
}

.tekst-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-x1);
    margin-bottom: var(--spacer-x2);
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: var(--spacer-x1);
    max-width: 1545px;
    margin: 0 auto;
    padding: var(--spacer-x1);
}

aside {
    max-width: 700px;
    max-height: 845px;
}

.gallery-img {
    max-width: 495px;
    max-height: 333px;
    object-fit: cover;
}

.gallery-img:nth-child(5) {
    grid-row: span 2;
    max-height: 674px;
}

.fat-text {
  font-weight: 700;
  padding: var(--spacer-x0-5) 0;
}

@media screen and (min-width: 768px) {
    .container {
        flex-direction: column;
    }


}


</style>