<script setup>
import { ref, onMounted } from "vue";
import TheHero from "@/components/TheHero.vue";
import TheSpinner from "@/components/TheSpinner.vue";
import TESTIMG from "@/assets/images/motion.jpg";
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import TheBtn from "@/components/TheBtn.vue";
import ImageHolder from "@/components/ImageHolder.vue";
import TheTeamCard from "@/components/TheTeamCard.vue";
import TheFilterBar from "@/components/TheFilterBar.vue";
import { useClassesStoreWater } from "@/stores/water-classes";
import TheInternNavWater from "@/components/TheInternNavWater.vue";

const classesStore = useClassesStoreWater();
const error = ref(null);
const isLoading = ref(true);
const vandogwellnessData = ref(null); // OBS: null er bedre end []

const CACHE_KEY = "vandogwellnessData";
const CACHE_TIMESTAMP_KEY = "cacheTimestamp";
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutter

onMounted(async () => {
  isLoading.value = true;
  error.value = null;

  await classesStore.fetchClasses();

  const cachedvwRaw = localStorage.getItem(CACHE_KEY);
  const cachedTimestampRaw = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  const now = Date.now();

  if (cachedvwRaw && cachedTimestampRaw) {
    const cachedTimestamp = Number(cachedTimestampRaw);

    if (now - cachedTimestamp < CACHE_DURATION_MS) {
      try {
        vandogwellnessData.value = JSON.parse(cachedvwRaw);
        isLoading.value = false;
        return;
      } catch (e) {
        console.warn("Fejl ved parsing af cached data:", e);
      }
    }
  }

  fetch("https://popular-gift-b355856076.strapiapp.com/api/vand-og-wellness?pLevel")
    .then(response => {
      if (!response.ok) {
        throw new Error(`Vand og Wellness - Regler fejl: ${response.status}`);
      }
      return response.json();
    })
    .then(json => {
      vandogwellnessData.value = json.data;
      localStorage.setItem(CACHE_KEY, JSON.stringify(vandogwellnessData.value));
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
</script>


<template>
    <main v-if="classesStore.isLoading || !vandogwellnessData" class="loading-container"><TheSpinner></TheSpinner></main>
    <main v-else-if="error">Der opstod en fejl: {{ error }}</main>
    <main v-else>
      <TheHero class="heroImage"
        :title="vandogwellnessData.Hero_sektion.Hero_titel_h5.Titel_H5"
        :subtitle="vandogwellnessData.Hero_sektion.Hero_undertitel_h6.Undertitel_H6"
        :image="vandogwellnessData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].url"
        :alt="vandogwellnessData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].alternativeText"></TheHero>
      <TheBreadcrumb></TheBreadcrumb>
      <TheInternNavWater></TheInternNavWater>

      <section>
            <div class="textsection">
                <article class="flex--column flex1">
                    <h1>Holdtræning i vand for alle aldre</h1>
                    <p>Uanset om du er til leg og læring i vandet, afslappende saunagus eller rolig bevægelse i varmtvandsbassinet, har vi et hold, der passer til dig.</p>
                    <p>I vores holdoversigt kan du finde vandaktiviteter for både børn og unge – samt forskellige wellness-hold for voksne, hvor velvære og ro er i fokus.</p>
                    <p>Flere gange om året revideres vores holdplan, således at vi altid har spændende og aktuelle aktiviteter på programmet.</p>
                    <div class="btn--container">
                    <TheBtn
                    link="VW regler"
                    title="Til- og afmeldingsfrister for hold"
                    text="Få overblik over frister for til- og afmelding."
                    icon="Arrow_forward"></TheBtn>
                </div>
            </article>
            <div class="img--container flex1">
                <ImageHolder class="img" :src="TESTIMG" alt="Et billede" />
            </div>
            </div>
        </section>

      <section class="elementspacing">
          <TheFilterBar
            :labels="classesStore.availableCategories" :store="classesStore"
            :selectedCategory="classesStore.selectedCategory"
            @categorySelected="classesStore.setCategory"
          ></TheFilterBar>

        <article> 
          <div class="teams--view">
            <p>Viser {{ classesStore.numberOfClasses }} ud af {{ classesStore.numberOfTeams }} hold</p>
            <div class="grid-container">
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
              ></TheTeamCard>
            </div>
          </div>
        </article>
      </section>
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