<script setup>
import { ref, onMounted } from "vue";
import TheHero from "@/components/TheHero.vue";
import TheSpinner from "@/components/TheSpinner.vue";
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import TheBtn from "@/components/TheBtn.vue";
import DynamicHeading from "@/components/DynamicHeading.vue";
import ImageHolder from "@/components/ImageHolder.vue";
import TheTeamCard from "@/components/TheTeamCard.vue";
import Reklamekort from "@/components/Reklamekort.vue";
import TheFilterBar from "@/components/TheFilterBar.vue";
import { useClassesStoreMotion } from "@/stores/motion-classes";
import TheInternNavHaraldslund from "@/components/TheInternNavHaraldslund.vue";

const classesStore = useClassesStoreMotion();
const error = ref(null);
const isLoading = ref(true);
const motionHoldData = ref(null);

const CACHE_KEY = "motionHoldData";
const CACHE_TIMESTAMP_KEY = "motionsHoldTimestamp";
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutter

onMounted(async () => {
  isLoading.value = true;
  error.value = null;

  await classesStore.fetchClasses();

  const cachedMotionholdRaw = localStorage.getItem(CACHE_KEY);
  const cachedTimestampRaw = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  const now = Date.now();

  if (cachedMotionholdRaw && cachedTimestampRaw) {
    const cachedTimestamp = Number(cachedTimestampRaw);

    if (now - cachedTimestamp < CACHE_DURATION_MS) {
      try {
        motionHoldData.value = JSON.parse(cachedMotionholdRaw);
        isLoading.value = false;
        return;
      } catch (e) {
        console.warn("Fejl ved parsing af cached data:", e);
      }
    }
  }

  fetch("https://popular-gift-b355856076.strapiapp.com/api/holdoversigt-motionscenter?pLevel")
    .then(response => {
      if (!response.ok) {
        throw new Error(`Motion Hold - Regler fejl: ${response.status}`);
      }
      return response.json();
    })
    .then(json => {
      motionHoldData.value = json.data;
      localStorage.setItem(CACHE_KEY, JSON.stringify(motionHoldData.value));
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
  { id: 1, label: "Om Motionscenteret", name: "om-motionscenteret" },
  { id: 2, label: "Holdoversigt", name: "holdoversigt-motionscenteret" },
  { id: 3, label: "Priser", name: "priser-motionscenteret" },
  { id: 4, label: "Regler", name: "regler-motionscenteret" },
  { id: 5, label: "Personlig træning", name: "personlig-traening-motionscenteret" },
  { id: 6, label: "Leje af sal & instruktør", name: "leje-af-sal-og-instruktor-motionscenteret" },
  { id: 7, label: "Sundhed & bevægelse", name: "sib-motionscenteret" },
];
</script>


<template>
    <div v-if="classesStore.isLoading || !motionHoldData" class="loading-container"><TheSpinner></TheSpinner></div>
    <div v-else-if="error">Der opstod en fejl: {{ error }}</div>
    <div v-else>
      <TheHero class="heroImage"
        :title="motionHoldData.Hero_sektion.Hero_titel_h5.Titel_H5"
        :subtitle="motionHoldData.Hero_sektion.Hero_undertitel_h6.Undertitel_H6"
        :image="motionHoldData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].url"
        :alt="motionHoldData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].alternativeText"></TheHero>
        <!-- REFERENCE BILLEDE: serebryannikov. Fil:#446475458. (online). Adobe Stock 2025. [Accessed 07/05/2025]. URL: https://stock.adobe.com/dk/images/web-banner-with-fitness-equipment-on-the-floor-in-the-sports-gym-mat-dumbbell-bottle-for-water-healthy-lifestyle-and-sport-exercises/446475458 -->
      <div class="page-wrapper">
        <TheBreadcrumb></TheBreadcrumb>
        <div class="content-container">
          <TheInternNavHaraldslund :label="internNavLabels"></TheInternNavHaraldslund>
        </div>
        <section class="textsection" v-for="(tekstsektion,index) in motionHoldData.Indhold.Afsnit" :key="tekstsektion.id">
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
              <ImageHolder v-for="billede in tekstsektion.Billede" :key="billede.id" class="img" :src="getImage(billede)" :alt="billede.alternativeText"></ImageHolder>
          </div>
        </section>
        <section class="elementspacing">
            <TheFilterBar
              :labels="classesStore.availableCategories" :store="classesStore"
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
              >
              Viser {{ classesStore.numberOfClasses }} ud af {{ classesStore.numberOfTeams }} hold</p>
              <div class="grid-container">
                <TheTeamCard
                  v-for="klasse in classesStore.filteredClasses"
                  :key="klasse.id"
                  :labels="{ label: klasse.name || 'Ukendt hold' }"
                  icon="arrow_forward"
                  :backgroundColor="klasse.type_af_hold"
                  :teamCategorys="klasse.kategorier"
                  :link="{ name: 'holdbeskrivelse-motion', params: { id: klasse.id } }"
                  :teamImage="getCoverImage(klasse)"
                  :alt="klasse.coverbilledeAlt || ' Holdbillede'" 
                  aria-live="polite"
                  aria-busy="classesStore.isLoading" 
                ></TheTeamCard>
              </div>
            </div>
          </article>
          <!-- REFERENCER TIL BILLEDER:
          Specialhold: #221789. billede: #20815361. (online). Colourbox.dk 2025. [Accessed 07/05/2025]. URL: https://www.colourbox.dk/billede/senior-motion-aeldre-billede-20815361
          Core, Stabilitet og Styrke: #232319. billede: #37584145 (online). Colourbox.dk 2025 . [Accessed 07/05/2025]. URL: https://www.colourbox.dk/billede/fitness-gruppe-aeldre-billede-37584145
          Core & Stabilitet: #232319. billede: #36864606. (online).Colourbox.dk 2025. [Accessed 07/05/2025]. URL: https://www.colourbox.dk/billede/traening-aeldre-gruppe-billede-36864606
          Grith Strength: Syda Productions. billede: #26909541. (online). Colourbox.dk 2025. [Accessed 07/05/2025]. URL: https://www.colourbox.dk/billede/motionscenter-hold-kondi-billede-26909541
          Yoga: Takoburito. billede: #46950024. (online). Colourbox.dk 2025. [Accessed 07/05/2025]. URL: https://www.colourbox.dk/billede/hold-yoga-aktiv-billede-46950024
          Morgen Yoga Flow: Takoburito. billede: #46950001. (online). Colourbox.dk 2025. [Accessed 07/05/2025]. URL: https://www.colourbox.dk/billede/hold-yoga-aktiv-billede-46950001
          Yin Yoga: Takoburito. billede: #46950007. (online). Colourbox.dk 2025. [Accessed 07/05/2025]. URL: https://www.colourbox.dk/billede/aktiv-sport-mediterende-billede-46950007
          Yin Flow: Takoburito. billede: #46950014. (online). Colourbox.dk 2025. [Accessed 07/05/2025]. URL: https://www.colourbox.dk/billede/yoga-aktiv-aktivitet-billede-46950014
          Yin Yang Yoga: Takoburito. billede: #46950021. (online). Colourbox.dk 2025. [Accessed 07/05/2025]. URL: https://www.colourbox.dk/billede/yoga-hold-aktiv-billede-46950021
          Hatha Yoga: Takoburito. billede: #46949999. (online). Colourbox.dk 2025. [Accessed 07/05/2025]. URL: https://www.colourbox.dk/billede/aktiv-sport-mediterende-billede-46949999
          Grith Cardio: Takoburito. billede: #33870794. (online). Colourbox.dk 2025. [Accessed 07/05/2025]. URL:https://www.colourbox.dk/billede/motionscenter-kondi-koncept-billede-33870794
          Jumping Fitness: Facebook: Haraldslund Vand og kulturhus. 05/03/2018. (online). Facebook.com. Meta 2025. [Accessed 07/05/2025]. URL:https://www.facebook.com/Haraldslund/photos/pb.100047675655563.-2207520000/1715303271861093/?type=3
          -->
        </section>
        <Reklamekort
          :src="getImage(motionHoldData.reklame_kort.Billede)"
          :alt="motionHoldData.reklame_kort.Billede.alternativeText" 
          :title="motionHoldData.reklame_kort.Titel"
          :text="motionHoldData.reklame_kort.Tekst_afsnit" 
          :Btn_title="motionHoldData.reklame_kort.Knapper[0].btn_titel" 
          :Btn_text="motionHoldData.reklame_kort.Knapper[0].btn_description" 
          :kategori="motionHoldData.reklame_kort.Kategori" 
          :Btn_icon="motionHoldData.reklame_kort.Knapper[0].Ikon[0]"></Reklamekort>
      </div>
    </div>
</template>

<style scoped>

.textsection {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-x2);
  margin: 0 auto;
  margin-bottom: var(--mobile-site-space);
  width: 100%;
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

.page-wrapper {
    display: flex;
    flex-direction: column;
    max-width: var(--max-width);
    width: 95%;
    margin: 0 auto;
}

.content-container {
    width: 100%;
    max-width: var(--max-width);
    padding-bottom: var(--spacer-x5);
    position: relative;
    height: fit-content;
    margin: 0 auto;
}

.breadcrumb-container {
  margin: 0;
}

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

@media screen and (min-width: 1300px) {
    .textsection {
        margin-bottom: var(--spacer-Elements);
    }
}
  
</style>