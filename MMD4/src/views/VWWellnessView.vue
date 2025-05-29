<script setup>
import TheHero from "../components/TheHero.vue";
import TheInternNavHaraldslund from "@/components/TheInternNavHaraldslund.vue";
import TheBreadcrumb from "../components/TheBreadcrumb.vue";
import TheSpinner from "@/components/TheSpinner.vue";
import TheBtn from '@/components/TheBtn.vue';
import Reklamekort from '@/components/Reklamekort.vue';
import ImageHolder from '@/components/ImageHolder.vue';
import DynamicHeading from '@/components/DynamicHeading.vue';
import { ref, onMounted } from 'vue';


const internNavLabels = [
    { id: 1, label: "Svømmehallen", name: "svommehallen-vandogwellness" },
    { id: 2, label: "Wellness", name: "wellness-vandogwellness" },
    { id: 3, label: "Holdoversigt", name: "holdoversigt-vandogwellness" },
    { id: 4, label: "Priser", name: "priser-vandogwellness" },
    { id: 5, label: "Regler", name: "regler-vandogwellness" },
];


const wellnessData = ref([]);
const isLoading = ref(true);
const error = ref(null);

const CACHE_DURATION_MS = 5 * 60 * 1000;

onMounted(() => {
  isLoading.value = true;
  error.value = null;

  const cachedWellnessRaw = localStorage.getItem('wellnessData ');
  const cachedTimestampRaw = localStorage.getItem('cachewellnessTimestamp');
  const now = Date.now();

  if (cachedWellnessRaw && cachedTimestampRaw) {
    const cachedTimestamp = Number(cachedTimestampRaw);

    if (now - cachedTimestamp < CACHE_DURATION_MS) {
      try {
        wellnessData .value = JSON.parse(cachedWellnessRaw);
        isLoading.value = false;
        return;
      } catch (e) {
        console.warn('Fejl ved parsing af cached data:', e);
      }
    }
  }

  fetch('https://popular-gift-b355856076.strapiapp.com/api/wellness?pLevel')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Wellness fejl: ${response.status}`);
      }
      return response.json();
    })
    .then(json => {
      wellnessData .value = json.data;
      localStorage.setItem('wellnessData ', JSON.stringify(wellnessData .value));
      localStorage.setItem('cachewellnessTimestamp', now.toString());
    })
    .catch(err => {
      error.value = err.message;
    })
    .finally(() => {
      isLoading.value = false;
    });
});


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
        <TheHero class="heroImage"
        :title="wellnessData .Hero_sektion.Hero_titel_h5.Titel_H5"
        :subtitle="wellnessData .Hero_sektion.Hero_undertitel_h6.Undertitel_H6"
        :image="wellnessData .Hero_sektion.Hero_Baggrundsbillede.Billede[0].url"
        :alt="wellnessData .Hero_sektion.Hero_Baggrundsbillede.Billede[0].alternativeText"></TheHero>

        <TheBreadcrumb></TheBreadcrumb>
        <TheInternNavHaraldslund
            :label="internNavLabels"
        ></TheInternNavHaraldslund>
        
        <section v-for="(tekstsektion,index) in wellnessData .Indhold.Afsnit" :key="tekstsektion.id">
            <div class="textsection" :class="['textsection', { 'small-margin': index === 1 }, { 'reverse-layout': index === 2 }]">
                <article class="flex--column flex1">
                    <DynamicHeading :level="index === 0 ? 1 : Math.min(index + 1, 6)">{{ tekstsektion.Overskrift }}</DynamicHeading>
                    <div v-for="(single_text,i) in tekstsektion.Tekst || []" :key="single_text.id">
                      <DynamicHeading :level="Math.min(index+i+2, 5)">{{ single_text.Underoverskift}}</DynamicHeading>
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
                    :icon="btn.Ikon[0]"></TheBtn>
                </div>
            </article>
            <div class="img--container flex1" v-for="billede in tekstsektion.Billede" :key="billede.id">
                <ImageHolder class="img" :src="getImage(billede)" :alt="billede.alternativeText" />
            </div>
            </div>
            <div class="galleri" v-if="index === 1">
                <ImageHolder  v-for="billede in wellnessData .Billeder" :key="billede.id" class="galleryImg" :src="getImage(billede)" :alt="billede.alternativeText" />
            </div>
        </section>
        
        <Reklamekort
        :src="getImage(wellnessData .reklame_kort.Billede)"
        :alt="wellnessData .reklame_kort.Billede.alternativeText" 
        :title="wellnessData .reklame_kort.Titel"
        :text="wellnessData .reklame_kort.Tekst_afsnit" 
        :Btn_title="wellnessData .reklame_kort.Knapper[0].btn_titel" 
        :Btn_text="wellnessData .reklame_kort.Knapper[0].btn_description" 
        :kategori="wellnessData .reklame_kort.Kategori" 
        :Btn_icon="wellnessData .reklame_kort.Knapper[0].Ikon[0]"></Reklamekort>
    </div>
</template>

<style scoped>

.loading-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.galleri {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: 300px;
  gap: var(--spacer-x1);
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  margin-bottom: var(--spacer-x1);
}

.galleri .galleryImg:nth-child(n+3) {
  display: none;
}


.galleryImg{
    width: 100%;
    object-fit: cover;
    object-position: top;
}
.galleryImg img{
    object-position: top;
}

/* TEKST SECTION STYLE */

.textsection {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-x2);
  margin: 0 auto;
  margin-bottom: var(--spacer-Elements);
  max-width: var(--max-width);
  color: var(--color-font-1);
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

    .galleri {
  grid-template-columns: repeat(2, 1fr);
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

.galleri{
    grid-template-columns: repeat(3, 1fr);
}

.galleri .galleryImg:nth-child(4) {
  grid-row: 1/3;
}

   .galleri .galleryImg:nth-child(n+3) {
  display: block;
}

}
@media screen and (min-width: 1000px) {

    .btn--container{
        flex-direction: row;
    }
}


/* TEKSTSTYLE SLUT */
</style>