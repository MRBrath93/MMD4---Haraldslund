<script setup>
// IMPORTS
import { ref, onMounted } from "vue";
import { useClassesStoreMotion } from "@/stores/motion-classes.js";

import TheHero from "@/components/TheHero.vue";
import TheInternNavMotion from "@/components/TheInternNavMotion.vue";
import TheSpinner from "@/components/TheSpinner.vue";
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import Reklamekort from "@/components/Reklamekort.vue";
import TheTeamCard from "@/components/TheTeamCard.vue";
import TheFilterBar from "@/components/TheFilterBar.vue";



// REAKTIVE VARIABLER
const classesStore = useClassesStoreMotion();
const isLoading = ref(true);
const error = ref(null);


// HENT DATA FRA STORE
onMounted(async () => {
  try {
    classesStore.fetchClasses();
  } catch (err) {
    error.value = "Beklager, der opstod en fejl under indlæsning af data.";
    console.error("Fejl under indlæsning af data:", err);
  } finally {
    isLoading.value = false;
  }
});

// FUNKTIONER
// Funktion der bestemmer hvilket billede der skal vises
function getCoverImage(klasse) {
  if (klasse.coverbilledeMedium) {
    return klasse.coverbilledeMedium; // Hvis medium er tilgængeligt, brug det
  } else if (klasse.coverbilledeSmall) {
    return klasse.coverbilledeSmall; // Ellers brug small
  } else {
    return klasse.coverbilledeThumbnail; // Hvis ingen af dem er tilgængelige, brug thumbnail
  }
};

// Intern navigation labels (fra Strapi)
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
    <main v-if="isLoading">Indlæser...</main>
    <main v-else-if="error">Der opstod en fejl: {{ error }}</main>
    <main v-else>
      <TheHero
          title="HARALDSLUND"
          subtitle="Holdoversigt"
          description="Læs om vores motionstilbud og holdoversigt. Find praktisk information om motionscenteret, herunder faciliteter, priser og holdbeskrivelser."
          :image="getCoverImage[0]|| ''"
          :alt="getCoverImage.alternativeText || 'Hero billede'"
      ></TheHero>
      <TheBreadcrumb></TheBreadcrumb>
      <TheInternNavMotion 
        :labels="internNavLabels"></TheInternNavMotion>
      <h1>Motionscenter Holdoversigt</h1>
      <p>Haraldslund Motionscenter tilbyder desuden mange spændende holdaktiviteter både på land og i vand, hvor du sammen med 
        andre kan træne eksempelvis styrke og kondition, eventuelt kombineret med din individuelle træning i centeret.</p>
      <p>Flere gange om året revideres vores holdplan, således at vi altid har spændende og aktuelle aktiviteter på programmet.</p>
      <section>
        <div class="filter-container">
          <i class="material-symbols-rounded">filter_alt</i>
          <h4>Kategorier:</h4>
          <TheFilterBar
            :labels="classesStore.availableCategories"
            :selectedCategory="classesStore.selectedCategory"
            @categorySelected="classesStore.setCategory"
          />

        </div>
        <section> 
          <h4>Holdbeskrivelser</h4>
          <div>
            <p>Viser {{ classesStore.numberOfClasses }} ud af {{ classesStore.numberOfTeams }} hold</p>
            <div class="grid-container">
              <TheTeamCard
                v-for="klasse in classesStore.filteredClasses"
                :key="klasse.id"
                :labels="{ label: klasse.name || 'Ukendt hold' }"
                icon="arrow_forward"
                backgroundColor="var(--color-motion)"
                :teamCategorys="klasse.kategorier"
                :link="{ name: 'holdbeskrivelse-motion', params: { id: klasse.id } }"
                :teamImage="getCoverImage(klasse)"
                :alt="klasse.coverbilledeAlt || ' Holdbillede'" 
              />
            </div>

            
          
          </div>
        </section>
      </section>
    </main>
</template>

<style scoped>
main{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.filter-container{
    display: flex;
    justify-content: center;
    gap: var(--spacer-x1);
}

.team-card {
  background-color: var(--color-motion);
}

.grid-container{
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacer-x1);
    width: 100%;
    margin: 0 auto;
}



@media screen and (min-width: 768px) {

  .grid-container {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    max-width: 1432px;
    margin: 0 auto;
  }


}
  
</style>