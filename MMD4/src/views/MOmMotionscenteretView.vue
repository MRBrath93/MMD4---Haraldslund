<script setup>
// IMPORTS
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import TheInternNavHaraldslund from "@/components/TheInternNavHaraldslund.vue";
import TheHero from "@/components/TheHero.vue";
import ImageHolder from "@/components/ImageHolder.vue";
import DynamicHeading from "@/components/DynamicHeading.vue";
import Reklamekort from "@/components/Reklamekort.vue";
import TheBtn from "@/components/TheBtn.vue";
import TheSpinner from "@/components/TheSpinner.vue";

import { ref, onMounted } from "vue";


// REAKTIVE VARIABLER
const motionData = ref(null);
const isLoading = ref(true);
const error = ref(null);

// CACHE VARIABLER
const CACHE_DURATION_MS = 60 * 60 * 1000;

// FETCH DATA FRA LOCAL STORAGE 
onMounted(() => {
  isLoading.value = true;
  error.value = null;
  const cachedMotionRaw = localStorage.getItem('motionData'); // Hent cached data
  const cachedTimestampRaw = localStorage.getItem('cachecenterTimestamp'); // Hent cached timestamp
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
        localStorage.setItem('cachecenterTimestamp', now.toString());
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
    <div v-else>
      <TheHero
        :title="motionData.Hero_sektion.Hero_titel_h5?.Titel_H5"
        :subtitle="motionData.Hero_sektion.Hero_undertitel_h6?.Undertitel_H6"
        description="Læs om vores moderne motionscenter."
        :image="motionData.Hero_sektion?.Hero_Baggrundsbillede?.Billede[0].url"
        :alt="motionData.Hero_sektion.Hero_Baggrundsbillede?.data?.attributes?.alternativeText || 'Hero billede'"></TheHero>
        <!-- BILLEDEREFERENCE: Facebook. Haraldslund Vand og Kulturhus. 15/08/2021 (online) Meta 2025 [Accessed 07/05/2025] URL: https://www.facebook.com/Haraldslund/photos/pb.100047675655563.-2207520000/4346970298694364/?type=3-->
        <div class="breadcrumb-container">
          <TheBreadcrumb></TheBreadcrumb>  
        </div>
      <TheInternNavHaraldslund :label="internNavLabels"></TheInternNavHaraldslund>


      <section class="textsection" v-for="(afsnit,index) in motionData.Indhold.Afsnit || []" :key="afsnit.id">
                <article class="flex--column flex1">
                    <DynamicHeading :level="index === 0 ? 1 : 2">{{ afsnit.Overskrift }}</DynamicHeading>
                    <div v-for="single_text, in afsnit.Tekst || []" :key="single_text.id">
                        <h5 class="subtitle" v-if="single_text.Underoverskift">{{ single_text.Underoverskift }}</h5>
                        <ul class="punkt" v-if="single_text.Skal_det_punktopstilles">
                            <li> {{ single_text.Brodtekst }}</li>
                        </ul>
                        <p v-else> {{ single_text.Brodtekst }}</p>
                    </div>
                    <div v-if="Array.isArray(afsnit.Knapper) && afsnit.Knapper.length > 0" class="btn--container">
                    <TheBtn
                    v-for="btn in afsnit.Knapper"
                    :key="btn.id"
                    :link="btn.link_to"
                    :title="btn.btn_titel"
                    :text="btn.btn_description"
                    :icon="btn.Ikon[0]"></TheBtn>
                </div>
            </article>
            <div class="img--container flex1">
                <ImageHolder v-for="billede in afsnit.Billede" :key="billede.id" class="img" :src="getImage(billede)" :alt="billede.alternativeText" />
            </div>
            <!-- BILLEDEREFERENCE: Facebook. Haraldslund Vand og Kulturhus. 15/11/2022 (online) Meta 2025 [accessed 08/05/2025] URL: https://www.facebook.com/photo.php?fbid=668412328091283&set=pb.100047675655563.-2207520000&type=3-->
        </section>
      <article>
        <h2>Udforsk vores faciliteter i motionscentret</h2>
        <div class="gallery-grid">
          <ImageHolder
            v-for="billede in motionData.Billeder"
            :key="billede.id"
            class="gallery-img"
            :src="getImage(billede)"
            :alt="billede?.data?.attributes?.alternativeText || 'Billede'"></ImageHolder>
        </div>
        <!-- BILLEDEREFERENCE: Facebook. Haraldslund Vand og Kulturhus. 15/11/2022 (online) Meta 2025 [accessed 08/05/2025] URL: https://www.facebook.com/photo.php?fbid=668412401424609&set=pb.100047675655563.-2207520000&type=3 -->
        <!-- BILLEDEREFERENCE: Facebook. Haraldslund Vand og Kulturhus. 15/11/2022 (online) Meta 2025 [accessed 08/05/2025] URL: https://www.facebook.com/photo/?fbid=668412514757931&set=pb.100047675655563.-2207520000 -->
      </article>
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
    </div>
  </template>
  
<style scoped>

.loading-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.textsection {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-x2);
  margin: 0 auto;
  margin-bottom: var(--spacer-Elements);
  width: 95%;
  max-width: var(--max-width);
  color: var(--color-font-1);
}

.img--container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.img{
    height: 100%;
}

.subtitle{
    margin-top: var(--spacer-x1);
}

.punkt{
    margin-inline-start: var(--spacer-x1);
    font-family: var(--font-text);
    
}

.btn--container{
    display: flex;
    flex-direction: column;
    justify-content: left;
    gap: var(--spacer-x1);
    width: 100%;
    margin: var(--spacer-x1) 0;
}

.flex--column{
    display: flex;
    flex-direction: column;
    gap: var(--spacer-x1);
    height: fit-content;
}

.flex1{
    flex: 1;
}

section{
    width: 95%;
    margin: 0 auto;
}

@media screen and (min-width: 500px) {
    .btn--container{
        flex-direction: row;
    }
}

@media screen and (min-width: 900px) {
    .textsection{
        flex-direction: row;
    }
    .btn--container{
        flex-direction: column;
    }

}
@media screen and (min-width: 1000px) {

    .btn--container{
        flex-direction: row;
    }
}
/* TEKSTSTYLE SLUT */

.breadcrumb-container {
  width: 95%;
}

.section-wrapper {
  max-width: var(--max-width);
  width: 95%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacer-x1);
}

.text-wrapper {
  grid-column: 1;
}

.image-wrapper {

  display: flex;
  align-items: center;
  justify-content: center;
  }

.side-img {
  max-width: 100%;
  height: 300px;
}

article h2 {
    margin: var(--spacer-x1) 0;
    text-align: center;
}

.gallery-img {
  max-width: 495px;
  max-height: 333px;
  object-fit: cover;
}

.gallery-img:nth-child(3) {
  grid-row: span 2;
  max-height: 674px;
}

.fat-text {
  font-weight: 700;
  padding: var(--spacer-x0-5) 0;
}

.section-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-x1);
  column-gap: var(--spacer-x4);
  margin-bottom: var(--spacer-Elements);
}

.gallery-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: 300px;
  width: 100%;
  max-width: var(--max-width);
  gap: var(--spacer-x1);
  margin: 0 auto;
  padding: var(--spacer-x1);
}

/* --- MEDIA QUERIES --- */

@media screen and (min-width: 768px) {
  .gallery-grid {
  grid-template-columns: repeat(2, 1fr);
  }

  .section-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.image-wrapper {
  grid-row-start: span 2;
  grid-column: 2;
  max-width: 700px;
}

.side-img {
  height: 500px;
}
  
}

@media screen and (min-width: 1200px) {
.gallery-grid {
  grid-template-columns: repeat(3, 1fr);

}
}

</style>