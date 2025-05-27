<script setup>
import { ref, watchEffect, onMounted, watch, computed, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import TheSpinner from '@/components/TheSpinner.vue';
import TheHero from '@/components/TheHero.vue';
import TheBtn from '@/components/TheBtn.vue';
import DynamicHeading from '@/components/DynamicHeading.vue';
import TheBreadcrumb from '@/components/TheBreadcrumb.vue';
import TheTeamCard from '@/components/TheTeamCard.vue';
import Reklamekort from '@/components/Reklamekort.vue';
import ImageHolder from '@/components/ImageHolder.vue';
import BookingSquare from '@/components/BookingSquare.vue';
import QuickInfo from '@/components/QuickInfo.vue';
import { useClassesStoreWater } from '@/stores/water-classes';

const route = useRoute();
const classesStore = useClassesStoreWater();
const CACHE_KEY = "vandogwellnessHoldData";
const CACHE_TIMESTAMP_KEY = "vandogwellnessHoldTimestamp";
const CACHE_DURATION_MS = 5 * 60 * 60 * 12;
const classId = Number(route.params.id);
const selectedClass = ref(null);
const isLoadingExtra = ref(false);
const extraError = ref(null);
const vandogwellnessHoldData = ref(null); 

onMounted(async () => {
  if (classesStore.classes.length === 0) {
    await classesStore.fetchClasses();
  }

  // Forsøg at hente fra localStorage
  isLoadingExtra.value = true;
  extraError.value = null;

  const cachedRaw = localStorage.getItem(CACHE_KEY);
  const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  const now = Date.now();

  if (cachedRaw && cachedTimestamp && now - Number(cachedTimestamp) < CACHE_DURATION_MS) {
    try {
      vandogwellnessHoldData.value = JSON.parse(cachedRaw);
      isLoadingExtra.value = false;
      return;
    } catch (e) {
      console.warn("Kunne ikke parse cache:", e);
    }
  }

  // Fetch hvis cache ikke er gyldig
  try {
    const response = await fetch("https://popular-gift-b355856076.strapiapp.com/api/holdoversigt-vand-og-wellness?pLevel");
    if (!response.ok) throw new Error(`Fejl ved hentning: ${response.status}`);
    
    const json = await response.json();
    vandogwellnessHoldData.value = json.data;

    // Gem til localStorage
    localStorage.setItem(CACHE_KEY, JSON.stringify(json.data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
  } catch (err) {
    extraError.value = err.message;
    console.error("Fetch-fejl:", err);
  } finally {
    isLoadingExtra.value = false;
  }
});


watchEffect(() => {
  if (!classesStore.isLoading) {
    selectedClass.value = classesStore.getClassById(classId);
  }
});

// Opdater selectedClass ved ruteskift (når id ændres)
watch(
  () => route.params.id,
  (newId) => {
    const numericId = Number(newId);
    selectedClass.value = classesStore.getClassById(numericId);
  }
);

function getArticleImage(klasse) {
  if (klasse.billedeMedium) {
    return klasse.billedeMedium;
  } else if (klasse.billedeSmall) {
    return klasse.billedeSmall;
  } else {
    return klasse.billedeThumbnail;
  }
}

function getCoverImage(klasse) {
  if (klasse.coverbilledeMedium) {
    return klasse.coverbilledeMedium;
  } else if (klasse.coverbilledeSmall) {
    return klasse.coverbilledeSmall;
  } else {
    return klasse.coverbilledeThumbnail;
  }
}


const screenWidth = ref(window.innerWidth);

function handleResize() {
  screenWidth.value = window.innerWidth;
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const visibleTeamCards = computed(() => {
  if (screenWidth.value < 600) return 1;
  if (screenWidth.value < 900) return 2;
  return 3;
});

</script>

<template>
  <div v-if="classesStore.isLoading || !vandogwellnessHoldData" class="loading-container">
    <TheSpinner></TheSpinner>
  </div>
  
  <div v-else-if="selectedClass">
    <TheHero class="heroImage"
    :title="vandogwellnessHoldData.Hero_sektion.Hero_titel_h5.Titel_H5"
    :subtitle="vandogwellnessHoldData.Hero_sektion.Hero_undertitel_h6.Undertitel_H6"
    :image="vandogwellnessHoldData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].url"
    :alt="vandogwellnessHoldData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].alternativeText"></TheHero>
    <TheBreadcrumb></TheBreadcrumb>
    
    <section class="textsection" v-for="(tekstsektion,index) in selectedClass.indhold.afsnit" :key="tekstsektion.id">
        <article class="flex--column flex1">
          <DynamicHeading :level="index === 0 ? 1 : 2">{{ tekstsektion.overskrift }}</DynamicHeading>
          <div v-for="(single_text,i) in tekstsektion.tekst || []" :key="single_text.id">
            <DynamicHeading :level="Math.min(index+i+2, 5)">{{ single_text.underoverskrift}}</DynamicHeading>
            <ul class="punkt" v-if="single_text.punktopstilles === true">
              <li> {{ single_text.brodtekst }}</li>
            </ul>
            <p v-else> {{ single_text.brodtekst }}</p>
          </div>
          <div v-if="Array.isArray(tekstsektion.knapper) && tekstsektion.knapper.length > 0" class="btn--container">
            <TheBtn v-for="btn in tekstsektion.knapper"
            :key="btn.id"
            :link="btn.link_to"
            :title="btn.titel"
            :text="btn.beskrivelse"
            :icon="btn.ikon"></TheBtn>
          </div>
        </article>
        <div class="img--container flex1">
        <ImageHolder v-for="billede in tekstsektion.billeder" :key="billede.id" class="img" :src="getArticleImage(billede)" :alt="billede.alternativeText" />
        </div>
    </section>
    <section class="overviewGrid">
      <QuickInfo class="quickinfo"  :time="selectedClass.varighed" :group="selectedClass.maalgruppe" :priser="selectedClass.priser" :praticalInfo="selectedClass.praktiskeOplysninger" :cancelBooking="selectedClass.aflysning" :type_af_hold="selectedClass.type_af_hold"></QuickInfo>
      <BookingSquare title="Sådan tilmelder du dig" text="Du kan tilmelde dig gennem vores online booking system via. nedenstående link." btn_title="Booking" btn_text="Foretag din booking her" btn_path="Booking" btn_icon="arrow_forward" :type_af_hold="selectedClass.type_af_hold" ></BookingSquare>
      <BookingSquare title="Til- & Afmeldingsfrister" text="Er du forhindret i at deltage på holdet? Sørg for at melde afbud i rette tid." btn_title="Til- & Afmeldingsfrister" btn_text="Få styr på diverse frister" btn_path="VW regler" btn_icon="arrow_forward" :type_af_hold="selectedClass.type_af_hold" ></BookingSquare>
    </section>

    <section>
      <h3 class="heading">Måske du også kan lide</h3>
      <div class="three--column-grid">
        <TheTeamCard v-for="relatedTeam in selectedClass.relateredeHold.slice(0, visibleTeamCards)"
        :key="relatedTeam.id"
        :labels="{ label: relatedTeam.name || 'Ukendt hold' }"
        icon="arrow_forward"
        :backgroundColor="relatedTeam.type_af_hold"
        :teamCategorys="relatedTeam.kategorier"
        :link="{ name: 'holdbeskrivelse-vandogwellness', params: { id: relatedTeam.id } }"
        :teamImage="getCoverImage(relatedTeam)"
        :alt="relatedTeam.coverbilledeAlt || ' Holdbillede'" ></TheTeamCard>
      </div>
    </section>
    <Reklamekort v-if="selectedClass.reklamekort"
    :src="getArticleImage(selectedClass.reklamekort)" 
    :alt="selectedClass.reklamekort.billedeAlt" 
    :title="selectedClass.reklamekort.titel" 
    :text="selectedClass.reklamekort.tekst"
    :Btn_title="selectedClass.reklamekort.knapper[0].titel" 
    :Btn_text="selectedClass.reklamekort.knapper[0].beskrivelse" 
    :kategori="selectedClass.reklamekort.kategori"
    :Btn_icon="selectedClass.reklamekort.knapper[0].ikon"></Reklamekort>
  </div>
  
  <div v-else>
    <p>Holdet med ID {{ $route.params.id }} blev ikke fundet.</p>
  </div>
</template>

<style scoped>

.loading-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.three--column-grid{
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacer-x1);
  width: 100%;
  margin-bottom: var(--spacer-Elements);
}

.heading{
  text-align: center;
  width: 100%;
  margin-bottom: var(--spacer-x1);
}

.overviewGrid{
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacer-x1);
  max-width: var(--max-width);
  margin-bottom: var(--spacer-Elements);
}

.quickinfo{
  grid-row: 1/3;
}

.flexColumn{
  display: flex;
  flex-direction: column;
  gap: var(--spacer-x1);
}

section{
  max-width: var(--max-width);
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

@media screen and (min-width: 600px) {
    .overviewGrid{
      grid-template-columns: repeat(2,1fr);
    }

    .three--column-grid{
      grid-template-columns: repeat(2,1fr);
    }

}

@media screen and (min-width: 900px) {
    .textsection{
        flex-direction: row;
    }
    .btn--container{
        flex-direction: column;
    }

    .three--column-grid{
      grid-template-columns: repeat(3,1fr);
    }
}
@media screen and (min-width: 1000px) {

    .btn--container{
        flex-direction: row;
    }
}
/* TEKSTSTYLE SLUT */
</style>
