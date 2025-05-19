<script setup>
// IMPORTS 
import { ref, onMounted } from "vue";
import TheHero from "@/components/TheHero.vue";
import TheInternNavMotion from "@/components/TheInternNavMotion.vue";
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


onMounted(() => {
  fetch('https://popular-gift-b355856076.strapiapp.com/api/priser-motion?pLevel')
  .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP fejl! Status: ${response.status}`);
      }
      return response.json();
    })    
    .then(data => {
        motionPriser.value = data.data;
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
    <main v-if="isLoading">        
        <TheSpinner>
            <span class="material-icons">sports_gymnastics</span>
        </TheSpinner>
    </main>
    <main v-else-if="error">Der opstod en fejl: {{ error }}</main>
    <main v-else>
        <TheHero
        :title="motionPriser.Hero_sektion.Hero_titel_h5?.Titel_H5"
        :subtitle="motionPriser.Hero_sektion.Hero_undertitel_h6?.Undertitel_H6"
        description="Prisoversigt for motionstilbud i Haraldslund Vand og Kulturhus."
        :image="getImage(motionPriser.Hero_sektion?.Hero_Baggrundsbillede?.Billede[0])"
        :alt="motionPriser.Hero_sektion.Hero_Baggrundsbillede?.data?.attributes?.alternativeText || 'Hero billede'" />

      <TheBreadcrumb />  
  
      <TheInternNavMotion :labels="internNavLabels" />
      <h1>Priser - Motion</h1>
      <section class="container-priser">
        <article class="pris-article" v-for="adgTyper in motionPriser.Adgangstyper || []" :key="adgTyper.id" >
            <h3>{{ adgTyper.Titel }}</h3>
            <ul>
                <li v-for="(fordel, index) in adgTyper.Fordele || []" :key="'fordel-' + index">
                    <i class="material-symbols-rounded" aria-hidden="true">check</i> {{ fordel }}
                </li>
                <li v-for="(ulempe, index) in adgTyper.Ulemper || []" :key="'ulempe-' + index">
                    <i class="material-symbols-rounded" aria-hidden="true">exclamation</i> {{ ulempe }}
                </li>
            </ul>
            <h4 class="small" v-for="pris in adgTyper.Priser">{{ pris.Genstand }} {{ pris.Pris }},-</h4>
        </article>
    </section>
    <section class="white-bg" v-for="indhold in motionPriser.Indhold.Afsnit || []" :key="indhold.id">
        <h3>{{ indhold.Overskrift }}</h3>
        <div v-for="tekst in indhold.Tekst || []" :key="tekst.id">
        <ul class="liste" v-if="tekst.Skal_det_punktopstilles">
            <li> {{ tekst.Brodtekst }}</li>
        </ul>
        <p v-else> {{ tekst.Brodtekst }}</p>
        </div>

    </section>
  
    <Reklamekort></Reklamekort>

           
    
    </main>

</template>

<style scoped>

.container-priser {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacer-x1);
    max-width: 1000px;
}

.pris-article {
    background-color: var(--color-motion-light);
    padding: var(--spacer-x2);
    display: flex;
    flex-direction: column;
    width: 30.75rem;
}

.pris-article ul {
    list-style: none;
}

.pris-article li {
    display: flex;
    padding-bottom: var(--spacer-x0-5);
    font-family: var(--font-text);
}

.pris-article li i {
    padding-right: var(--spacer-x0-5);
}

h4 {
  display: flex;
  justify-content: flex-end;
}

main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.white-bg:nth-of-type(2n) {
    background-color: var(--color-activity-viewer);
    padding: var(--spacer-x3) var(--spacer-x5);
    max-width: 1043px;
    margin: var(--spacer-x4) auto;
}





</style>