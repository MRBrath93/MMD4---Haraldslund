<script setup>
import { ref, onMounted, watch } from "vue";
import TheHero from "@/components/TheHero.vue";
import TheSpinner from "@/components/TheSpinner.vue";
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import TheBtn from "@/components/TheBtn.vue";
import DynamicHeading from "@/components/DynamicHeading.vue";
import ImageHolder from "@/components/ImageHolder.vue";
import TheTeamCard from "@/components/TheTeamCard.vue";
import Reklamekort from "@/components/Reklamekort.vue";
import TheFilterBar from "@/components/TheFilterBar.vue";
import { useClassesStoreWater } from "@/stores/water-classes";
import TheInternNavHaraldslund from "@/components/TheInternNavHaraldslund.vue";

const classesStore = useClassesStoreWater();
const error = ref(null);
const isLoading = ref(true);
const vandogwellnessHoldData = ref(null); 
const loadingMessage = ref('Indhold indlæses...');

const CACHE_KEY = "vandogwellnessHoldData";
const CACHE_TIMESTAMP_KEY = "cachevandholdTimestamp";
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutter


watch(isLoading, (newVal) => {
  // loadingMessage.value = newVal ? 'Indhold indlæses...' : '';
  loadingMessage.value = 'Indhold indlæses...';
});

onMounted(async () => {
  isLoading.value = true;
  error.value = null;

  await classesStore.fetchClasses();

  const cachedvwholdRaw = localStorage.getItem(CACHE_KEY);
  const cachedTimestampRaw = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  const now = Date.now();

  if (cachedvwholdRaw && cachedTimestampRaw) {
    const cachedTimestamp = Number(cachedTimestampRaw);

    if (now - cachedTimestamp < CACHE_DURATION_MS) {
      try {
        vandogwellnessHoldData.value = JSON.parse(cachedvwholdRaw);
        isLoading.value = false;
        return;
      } catch (e) {
        console.warn("Fejl ved parsing af cached data:", e);
      }
    }
  }

  fetch("https://popular-gift-b355856076.strapiapp.com/api/holdoversigt-vand-og-wellness?pLevel")
    .then(response => {
      if (!response.ok) {
        throw new Error(`Vand og Wellness - Regler fejl: ${response.status}`);
      }
      return response.json();
    })
    .then(json => {
      vandogwellnessHoldData.value = json.data;
      localStorage.setItem(CACHE_KEY, JSON.stringify(vandogwellnessHoldData.value));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
    })
    .catch(err => {
      error.value = err.message;
    })
    .finally(() => {
      isLoading.value = false;
    });
});

function getCoverImage(klasse) {
  if (klasse.coverbilledeMedium) {
    return klasse.coverbilledeMedium;
  } else if (klasse.coverbilledeSmall) {
    return klasse.coverbilledeSmall;
  } else {
    return klasse.coverbilledeThumbnail;
  }
}

function getImage(billede) {
    if (!billede || !billede.formats) return '';
    return billede.formats.large?.url ||
        billede.formats.medium?.url ||
        billede.formats.small?.url ||
        billede.formats.thumbnail?.url ||
        billede.url || '';
}

const internNavLabels = [
    { id: 1, label: "Svømmehallen", name: "svommehallen-vandogwellness" },
    { id: 2, label: "Wellness", name: "wellness-vandogwellness" },
    { id: 3, label: "Holdoversigt", name: "holdoversigt-vandogwellness" },
    { id: 4, label: "Priser", name: "priser-vandogwellness" },
    { id: 5, label: "Regler", name: "regler-vandogwellness" },
];
</script>


<template>
    <div v-if="classesStore.isLoading || !vandogwellnessHoldData" class="loading-container"><TheSpinner></TheSpinner></div>
    <div v-else-if="error">Der opstod en fejl: {{ error }}</div>
    <div v-else>
      <TheHero class="heroImage"
        :title="vandogwellnessHoldData.Hero_sektion.Hero_titel_h5.Titel_H5"
        :subtitle="vandogwellnessHoldData.Hero_sektion.Hero_undertitel_h6.Undertitel_H6"
        :image="vandogwellnessHoldData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].url"
        :alt="vandogwellnessHoldData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].alternativeText"></TheHero>
      <TheBreadcrumb></TheBreadcrumb>
      <TheInternNavHaraldslund :label="internNavLabels"></TheInternNavHaraldslund>
      <section class="textsection" v-for="(tekstsektion,index) in vandogwellnessHoldData.Indhold.Afsnit" :key="tekstsektion.id">
                <article class="flex--column flex1">
                    <DynamicHeading :level="index === 0 ? 1 : 2">{{ tekstsektion.Overskrift }}</DynamicHeading>
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
                    :icon="btn.Ikon[0]"></TheBtn>
                </div>
            </article>
            <div class="img--container flex1">
                <ImageHolder v-for="billede in tekstsektion.Billede" :key="billede.id" class="img" :src="getImage(billede)" :alt="billede.alternativeText" />
            </div>
        </section>
      <section class="elementspacing">
          <TheFilterBar
            :labels="classesStore.availableCategories" 
            :store="classesStore"
            :selectedCategory="classesStore.selectedCategory"
            @categorySelected="classesStore.setCategory"
            aria-labelledby="filter-headline"
            role="search"
            tabindex="0"
          ></TheFilterBar>

        <article
        aria-labelledby="filtered-teams"
        >
          <h2 class="sr-only filtered-teams">Filtrerede holdresultater</h2>
          <div class="teams--view">
            <p
            aria-live="polite"
            role="status"
            >Viser {{ classesStore.numberOfClasses }} ud af {{ classesStore.numberOfTeams }} hold</p>
            <div 
            class="grid-container"
            >
            <TheTeamCard
            v-for="klasse in classesStore.filteredClasses"
            :key="klasse.id"
            :labels="{ label: klasse.name || 'Ukendt hold' }"
            icon="arrow_forward"
            :backgroundColor="klasse.type_af_hold"
            :teamCategorys="klasse.kategorier"
            :link="{ name: 'holdbeskrivelse-vandogwellness', params: { id: klasse.id } }"
            :teamImage="getCoverImage(klasse)"
            :alt="klasse.coverbilledeAlt || ' Holdbillede'" 
            aria-live="polite"
            :aria-busy="classesStore.isLoading" 
              ></TheTeamCard>

            <!-- BILLEDEREFERENCER:
               Plask og leg: URL Facebook: Haraldslund Vand og Kulturhus. 02/09/2019. (online) Facebook.com. Meta 2025. [Accessed 07/05/2025] URL: https://www.facebook.com/Haraldslund/photos/pb.100047675655563.-2207520000/2506492572742155/?type=3 -
               Vandgymnastik: URL Facebook: Haraldslund Vand og Kulturhus. 06/06/2020. (online) Facebook.com. Meta 2025. [Accessed 07/05/2025] URL: https://www.facebook.com/Haraldslund/photos/pb.100047675655563.-2207520000/3117678114956928/?type=3 -
               Babysvømning: Instagram. Haraldslund Vand og Kulturhus. 11/07/2024 (online) Meta 2025 [Accessed 08/05/2025] URL: https://www.instagram.com/haraldslundvandogkulturhus/p/C9R-yOZpLOi/
              kurbadsaftener: Facebook: Haraldslund Vand og Kulturhus. 08/05/2020. (online) Facebook.com. Meta 2025. [Accessed 07/05/2025] URL: https://www.facebook.com/Haraldslund/photos/pb.100047675655563.-2207520000/3042800045778069/?type=3
              Varmtvandstræning:  Angel Cortijo Nieto. billede: #41728130. (online) Colourbox.com. 2025 [Accessed 07/05/2025] URL: https://www.colourbox.dk/billede/swimming-badning-aeldre-billede-41728130
              Specialhold:  Angel Cortijo Nieto. billede: #40021547. (online) Colourbox.com. 2025 [Accessed 07/05/2025] URL: https://www.colourbox.dk/billede/aeldre-pool-badning-billede-40021547
              -->
            </div>
          </div>
        </article>
      </section>
      <Reklamekort
        :src="getImage(vandogwellnessHoldData.reklame_kort.Billede)"
        :alt="vandogwellnessHoldData.reklame_kort.Billede.alternativeText" 
        :title="vandogwellnessHoldData.reklame_kort.Titel"
        :text="vandogwellnessHoldData.reklame_kort.Tekst_afsnit" 
        :Btn_title="vandogwellnessHoldData.reklame_kort.Knapper[0].btn_titel" 
        :Btn_text="vandogwellnessHoldData.reklame_kort.Knapper[0].btn_description" 
        :kategori="vandogwellnessHoldData.reklame_kort.Kategori" 
        :Btn_icon="vandogwellnessHoldData.reklame_kort.Knapper[0].Ikon[0]"></Reklamekort>
    </div>
</template>

<style scoped>

/* TEKST SECTION STYLE */

.textsection {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-x2);
  margin: 0 auto;
  margin-bottom: var(--spacer-Elements);
  max-width: var(--max-width);
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

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
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


/* TEXT STYLEING SLUT */


.elementspacing{
  margin-bottom: var(--spacer-Elements);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.filter-container{
    display: flex;
    justify-content: center;
    gap: var(--spacer-x1);
}

.grid-container{
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacer-x1);
    width: 100%;
    margin: 0 auto;
}

section{
  width: 95%;
  max-width: var(--max-width);
  margin: 0 auto;
}

.teams--view{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}


@media screen and (min-width: 700px) {

  .grid-container {
    grid-template-columns: repeat(2,1fr);
    max-width: var(--max-width);
  }
}

@media screen and (min-width: 1000px) {

  .grid-container {
    grid-template-columns: repeat(3,1fr);
  }
}
  
  
</style>