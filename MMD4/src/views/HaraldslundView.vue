<script setup>
// IMPORTS
import TheHero from "../components/TheHero.vue";
import TheBreadcrumb from "../components/TheBreadcrumb.vue";
import TheSpinner from "@/components/TheSpinner.vue";
import TheBtn from '@/components/TheBtn.vue';
import Reklamekort from '@/components/Reklamekort.vue';
import ImageHolder from '@/components/ImageHolder.vue';
import DynamicHeading from '@/components/DynamicHeading.vue';
import { ref, onMounted } from 'vue';
import TheInternNavHaraldslund from "@/components/TheInternNavHaraldslund.vue";

// --- VARIABLER ---
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
    <template class="loading-container" v-if="isLoading">
        <TheSpinner>
            <span class="material-icons">sports_gymnastics</span>
        </TheSpinner>
    </template>
    <template v-else-if="error">Der opstod en fejl: {{ error }}</template>
    <template v-else>
        <TheHero
        :title="aboutData.Hero_sektion.Hero_titel_h5.Titel_H5"
        :subtitle="aboutData.Hero_sektion.Hero_undertitel_h6.Undertitel_H6"
        :image="aboutData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].url"
        :alt="aboutData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].alternativeText"/>
        <TheBreadcrumb/>
        <TheInternNavHaraldslund
        :label="internNavLabels"
        />
        <section v-for="(tekstsektion,index) in aboutData.Indhold.Afsnit" :key="tekstsektion.id">
            <div 
            class="textsection" 
            :class="['textsection', { 'small-margin': index === 1 }, { 'reverse-layout': index === 2 }]">
                <article class="flex--column flex1">
                    <DynamicHeading :level="index === 0 ? 1 : Math.min(index + 1, 6)">{{ tekstsektion.Overskrift }}</DynamicHeading>
                    <div v-for="single_text in tekstsektion.Tekst || []" :key="single_text.id">
                        <h5 class="subtitle" v-if="single_text.Underoverskift">{{ single_text.Underoverskift }}</h5>
                        <ul class="punkt" v-if="single_text.Skal_det_punktopstilles">
                            <li> {{ single_text.Brodtekst }}</li>
                        </ul>
                        <p v-else> {{ single_text.Brodtekst }}</p>
                    </div>
                    <div v-if="Array.isArray(tekstsektion.Knapper) && tekstsektion.Knapper.length > 0" class="btn--container">
                        <TheBtn
                        v-for="btn in tekstsektion.Knapper"
                        :key="btn.id"
                        :link="btn.link_to"
                        :title="btn.btn_titel"
                        :text="btn.btn_description"
                        :icon="btn.Ikon[0]"/>
                    </div>
                </article>
                <div class="img--container flex1" v-for="billede in tekstsektion.Billede" :key="billede.id">
                    <ImageHolder 
                    class="img" 
                    :src="getImage(billede)" 
                    :alt="billede.alternativeText"/>
                </div>
            </div>
        </section>
        
        <Reklamekort v-if="aboutData.reklame_kort"
        :src="getImage(aboutData.reklame_kort.Billede)" 
        :alt="aboutData.reklame_kort.Billede.alternativeText" 
        :title="aboutData.reklame_kort.Titel" 
        :text="aboutData.reklame_kort.Tekst_afsnit" 
        :Btn_title="aboutData.reklame_kort.Knapper[0].btn_titel" 
        :Btn_text="aboutData.reklame_kort.Knapper[0].btn_description" 
        :kategori="aboutData.reklame_kort.Kategori" 
        :Btn_icon="aboutData.reklame_kort.Knapper[0].Ikon[0]"/>
    </template>
</template>

<style scoped>

section{
    max-width: var(--max-width);
    margin: 0 auto;
}

.loading-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* TEKST SECTION STYLE */

.textsection {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-x2);
  margin: 0 auto;
  margin-bottom: var(--spacer-Elements);
  width: 100%;
  max-width: var(--max-width);
}

.small-margin{
    margin: var(--spacer-x1) auto;
}

.small-margin .flex--column, .reverse-layout .flex--column{
    justify-content: center;
}

.img--container {
  flex: 1;
  display: flex;
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
    
    .reverse-layout{
        flex-direction: row-reverse;
    }
}

@media screen and (min-width: 1000px) {
    .btn--container{
        flex-direction: row;
    }
}

/* TEKSTSTYLE SLUT */
</style>