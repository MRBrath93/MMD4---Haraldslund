<script setup>
// IMPORTS 
import { ref, onMounted } from "vue";
import TheHero from "@/components/TheHero.vue";
import TheInternNavHaraldslund from "@/components/TheInternNavHaraldslund.vue";
import TheSpinner from "@/components/TheSpinner.vue";
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import Reklamekort from "@/components/Reklamekort.vue";

// FETCH DATA FRA STRAPI
const internNavLabels = [
  { id: 1, label: "Om Motionscenteret", name: "om-motionscenteret" },
  { id: 2, label: "Holdoversigt", name: "holdoversigt-motionscenteret" },
  { id: 3, label: "Priser", name: "priser-motionscenteret" },
  { id: 4, label: "Regler", name: "regler-motionscenteret" },
  { id: 5, label: "Personlig træning", name: "personlig-traening-motionscenteret" },
  { id: 6, label: "Leje af sal & instruktør", name: "leje-af-sal-og-instruktor-motionscenteret" },
  { id: 7, label: "Sundhed & bevægelse", name: "sib-motionscenteret" },
];

// FETCH DATA OG CACHE
onMounted(() => {
  isLoading.value = true;
  error.value = null;

  const cachedMotionPriserkRaw = localStorage.getItem('motionPriser');
  const cachedTimestampRaw = localStorage.getItem('cacheTimestamp');
  const now = Date.now();

  if (cachedMotionPriserkRaw && cachedTimestampRaw) {
    const cachedTimestamp = Number(cachedTimestampRaw);

    if (now - cachedTimestamp < CACHE_DURATION_MS) {
      try {
        motionPriser.value = JSON.parse(cachedMotionPriserkRaw);
        isLoading.value = false;
        return;
      } catch (e) {
        console.warn('Fejl ved parsing af cached data:', e);
      }
    }
  }

  fetch('https://popular-gift-b355856076.strapiapp.com/api/priser-motion?pLevel')
  .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP fejl! Status: ${response.status}`);
      }
      return response.json();
    })    
    .then(json => {
        motionPriser.value = json.data;
        localStorage.setItem('motionPriser', JSON.stringify(motionPriser.value));
        localStorage.setItem('cacheTimestamp', now.toString());   
    })
    .catch(err => {
      error.value = err.message;
    })
    .finally(() => {
      isLoading.value = false;
    });
});

// REAKTIVE VARIABLER
const motionPriser = ref(null);
const isLoading = ref(true);
const error = ref(null);

// CACHE VARIABLER
const CACHE_DURATION_MS = 5 * 60 * 1000;

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
    <div class="loading-container" v-if="isLoading">        
        <TheSpinner>
            <span class="material-icons">sports_gymnastics</span>
        </TheSpinner>
    </div>
    <div v-else-if="error">Der opstod en fejl: {{ error }}</div>
    <div class="first-wrapper" v-else>
        <TheHero
        :title="motionPriser.Hero_sektion.Hero_titel_h5?.Titel_H5"
        :subtitle="motionPriser.Hero_sektion.Hero_undertitel_h6?.Undertitel_H6"
        description="Prisoversigt for motionstilbud i Haraldslund Vand og Kulturhus."
        :image="motionPriser.Hero_sektion?.Hero_Baggrundsbillede?.Billede[0].url"
        :alt="motionPriser.Hero_sektion.Hero_Baggrundsbillede?.data?.attributes?.alternativeText || 'Hero billede'"></TheHero>
      <div class="page-wrapper">
        <TheBreadcrumb></TheBreadcrumb>  
        <div class="content-container">
            <TheInternNavHaraldslund :label="internNavLabels"></TheInternNavHaraldslund>
        </div>
        <h1 tabindex="-1">Priser - Motion</h1>
        <section class="container-priser">
            <article class="pris-article" v-for="enkeltPris in motionPriser.Enkeltbilletter || []" :key="enkeltPris.id" >
                <h3>{{ enkeltPris.Titel }}</h3>
                <ul>
                    <li v-for="(fordel, index) in enkeltPris.Fordele || []" :key="'fordel-' + index">
                        <i class="material-symbols-rounded" aria-hidden="true">check</i> {{ fordel }}
                    </li>
                    <li v-for="(ulempe, index) in enkeltPris.Ulemper || []" :key="'ulempe-' + index">
                        <i class="material-symbols-rounded" aria-hidden="true">exclamation</i> {{ ulempe }}
                    </li>
                </ul>
                <p class="small" v-for="pris in enkeltPris.Priser" :key="pris.id"> Pris: {{ pris.Genstand }} {{ pris.Pris }}<abbr title="kroner">,-</abbr></p>
            </article>
            <article class="pris-article" v-for="klipPris in motionPriser.Klippekort || []" :key="klipPris.id" >
                <h3>{{ klipPris.Titel }}</h3>
                <ul>
                    <li v-for="(fordel, index) in klipPris.Fordele || []" :key="'fordel-' + index">
                        <i class="material-symbols-rounded" aria-hidden="true">check</i> {{ fordel }}
                    </li>
                    <li v-for="(ulempe, index) in klipPris.Ulemper || []" :key="'ulempe-' + index">
                        <i class="material-symbols-rounded" aria-hidden="true">exclamation</i> {{ ulempe }}
                    </li>
                </ul>
                <p class="small" v-for="pris in klipPris.Priser" :key="pris.id"> Pris: {{ pris.Pris }}<abbr title="kroner">,-</abbr></p>
            </article>
            <article class="pris-article" v-for="programPris in motionPriser.Programlaegning || []" :key="programPris.id" >
                <h3>Programlægning</h3>
                <ul>
                    <li v-for="(fordel, index) in programPris.Fordele || []" :key="'fordel-' + index">
                        <i class="material-symbols-rounded" aria-hidden="true">check</i> {{ fordel }}
                    </li>
                    <li v-for="(ulempe, index) in programPris.Ulemper || []" :key="'ulempe-' + index">
                        <i class="material-symbols-rounded" aria-hidden="true">exclamation</i> {{ ulempe }}
                    </li>
                </ul>
                <p class="small" v-for="pris in programPris.Priser" :key="pris.id">Pris <abbr titel="per"> pr.</abbr> program: {{ pris.Pris }}<abbr title="kroner">,-</abbr></p>
            </article>
            <article class="pris-article" v-for="maanedsPris in motionPriser.Maanedskort || []" :key="maanedsPris.id" >
                <h3>{{ maanedsPris.Titel }}</h3>
                <ul>
                    <li v-for="(fordel, index) in maanedsPris.Fordele || []" :key="'fordel-' + index">
                        <i class="material-symbols-rounded" aria-hidden="true">check</i> {{ fordel }}
                    </li>
                    <li v-for="(ulempe, index) in maanedsPris.Ulemper || []" :key="'ulempe-' + index">
                        <i class="material-symbols-rounded" aria-hidden="true">exclamation</i> {{ ulempe }}
                    </li>
                </ul>
                <p class="small" v-for="pris in maanedsPris.Priser" :key="pris.id">Pris fra {{ pris.Pris }}<abbr title="kroner">,-</abbr></p>
            </article>
            <article class="pris-article">
                <div v-for="(personligPris, index) in motionPriser.Personlig_traening || []" :key="personligPris.id">
                    <template v-if="index === 0">
                        <h3>Personlig Træning</h3>
                        <ul>
                            <li v-for="fordel in personligPris.Fordele || []" :key="'fordel-' + fordel.index">
                                <i class="material-symbols-rounded" aria-hidden="true">check</i> {{ fordel }}
                            </li>
                            <li v-for="(ulempe, index) in personligPris.Ulemper || []" :key="'ulempe-' + index">
                                <i class="material-symbols-rounded" aria-hidden="true">exclamation</i> {{ ulempe }}
                            </li>
                        </ul>
                    </template>
                    <p class="small" v-for="pris in personligPris.Priser" :key="pris.id">{{ personligPris.Titel }}: {{ pris.Pris }}<abbr title="kroner">,-</abbr></p>
                </div>
            </article>
        </section>
        <section class="white-bg" v-for="indhold in motionPriser.Indhold.Afsnit || []" :key="indhold.id">
            <h3>{{ indhold.Overskrift }}</h3>
            <div v-for="tekst in indhold.Tekst || []" :key="tekst.id">
                <p class="fatText" v-if="tekst.Underoverskift" :key="tekst.id"> {{ tekst.Underoverskift }}</p>
                <ul class="liste" v-if="tekst.Skal_det_punktopstilles">
                    <li> {{ tekst.Brodtekst }}</li>
                </ul>
                <p v-else> {{ tekst.Brodtekst }}</p>
            </div>
        </section>
        <Reklamekort 
            :src="getImage(motionPriser.reklame_kort.Billede) || '' " 
            :alt="motionPriser.reklame_kort.Billede.alternativeText" 
            :title="motionPriser.reklame_kort.Titel" 
            :text="motionPriser.reklame_kort.Tekst_afsnit" 
            :Btn_title="motionPriser.reklame_kort.Knapper[0].btn_titel" 
            :Btn_text="motionPriser.reklame_kort.Knapper[0].btn_description" 
            :kategori="motionPriser.reklame_kort.Kategori" 
            :Btn_icon="motionPriser.reklame_kort.Knapper[0].Ikon[0]">
        </Reklamekort>
        </div>
    </div>
</template>

<style scoped>
.loading-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

h1 {
    max-width: var(--max-width);
    margin: auto;
    padding-bottom: var(--spacer-x2);
}

.pris-article .small {
    font-weight: bold;
    text-align: end;
}

abbr {
    text-decoration: none;
}

.container-priser {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(25rem, 1fr));
    gap: var(--spacer-x2-5);
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 var(--spacer-x2);
}

.pris-article {
    background-color: var(--color-motion-light);
    display: flex;
    flex-direction: column;
    padding: var(--spacer-x2);
    width: 100%;
    border-radius: var(--border-radius);
    color: var(--color-font-1);
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.25);
}

.pris-article ul {
    list-style: none;
    padding: 0;
}

.pris-article li {
    display: flex;
    padding-bottom: var(--spacer-x0-5);
}

li {
    font-family: var(--font-text);
}

.pris-article li i {
    padding-right: var(--spacer-x0-5);
}

article h3 {
    padding-bottom: var(--spacer-x0-5);
    color: var(--color-font-1);
}

.pris-article h4 {
  display: flex;
  justify-content: flex-start;
  color: var(--color-font-1);
}

main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.white-bg {
    width: 95%;
    max-width: var(--max-width);
}

.white-bg li{
    color: var(--color-font-1);
}

.white-bg:nth-of-type(2n) {
    background-color: var(--color-activity-viewer);
}

.white-bg {
    padding: var(--spacer-x3) var(--spacer-x5);
    max-width: 1043px;
    width: 95%;
    margin: var(--spacer-x4) auto;
}

.fatText {
  font-weight: 700;
  padding: var(--spacer-x0-5) 0;
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


@media screen and (min-width: 768px) {
    .pris-article h4 {
        justify-content: flex-end;
    }

    .container-priser {
        gap: var(--spacer-x2);
    }
}

</style>