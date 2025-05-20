<script setup>
import { ref, watchEffect, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TheSpinner from '@/components/TheSpinner.vue';
import TheHero from '@/components/TheHero.vue';
import TheBtn from '@/components/TheBtn.vue';
import DynamicHeading from '@/components/DynamicHeading.vue';
import TheBreadcrumb from '@/components/TheBreadcrumb.vue';
import ImageHolder from '@/components/ImageHolder.vue';
import { useClassesStoreWater } from '@/stores/water-classes';

const route = useRoute();
const classesStore = useClassesStoreWater();
const CACHE_KEY = "vandogwellnessHoldData";
const CACHE_TIMESTAMP_KEY = "vandogwellnessHoldTimestamp";
const CACHE_DURATION_MS = 1000 * 60 * 60 * 12;
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




function getArticleImage(klasse) {
  if (klasse.billedeMedium) {
    return klasse.billedeMedium;
  } else if (klasse.billedeSmall) {
    return klasse.billedeSmall;
  } else {
    return klasse.billedeThumbnail;
  }
}
</script>

<template>
  <main v-if="classesStore.isLoading || !vandogwellnessHoldData" class="loading-container">
    <TheSpinner></TheSpinner>
  </main>

  <main v-else-if="selectedClass">
    <TheHero class="heroImage"
        :title="vandogwellnessHoldData.Hero_sektion.Hero_titel_h5.Titel_H5"
        :subtitle="vandogwellnessHoldData.Hero_sektion.Hero_undertitel_h6.Undertitel_H6"
        :image="vandogwellnessHoldData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].url"
        :alt="vandogwellnessHoldData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].alternativeText"></TheHero>
        <TheBreadcrumb></TheBreadcrumb>

    <section v-for="(tekstsektion,index) in selectedClass.indhold.afsnit" :key="tekstsektion.id">
            <div class="textsection">
                <article class="flex--column flex1">
                    <DynamicHeading :level="index === 0 ? 1 : 2">{{ tekstsektion.overskrift }}</DynamicHeading>
                    <div v-for="single_text in tekstsektion.tekst || []" :key="single_text.id">
                        <h5 class="subtitle" v-if="single_text.underoverskrift">{{ single_text.underoverskrift }}</h5>
                        <ul class="punkt" v-if="single_text.punktopstilles">
                            <li> {{ single_text.brodtekst }}</li>
                        </ul>
                        <p v-else> {{ single_text.brodtekst }}</p>
                    </div>
                    <div v-if="Array.isArray(tekstsektion.knapper) && tekstsektion.knapper.length > 0" class="btn--container">
                    <TheBtn
                    v-for="btn in tekstsektion.knapper"
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
            </div>
        </section>


    <h3>Dette er holdet: {{ selectedClass.name }}</h3>
    <p>ID: {{ selectedClass.id }}</p>
    <p>Varighed: {{ selectedClass.varighed }}</p>
    <p>Aflysning: {{ selectedClass.aflysning }}</p>
    <p>Kategori: {{ selectedClass.type_af_hold }}</p>
   
  </main>

  <main v-else>
    <p>Holdet med ID {{ $route.params.id }} blev ikke fundet.</p>
  </main>
</template>


<style scoped>

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



.loading-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
