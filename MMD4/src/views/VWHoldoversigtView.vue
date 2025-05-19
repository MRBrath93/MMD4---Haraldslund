<script setup>
// IMPORTS
import { ref, onMounted } from "vue";

import TheHero from "@/components/TheHero.vue";
import TheSpinner from "@/components/TheSpinner.vue";
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import TheTeamCard from "@/components/TheTeamCard.vue";
import TheFilterBar from "@/components/TheFilterBar.vue";
import { useClassesStoreWater } from "@/stores/water-classes";
import TheInternNavWater from "@/components/TheInternNavWater.vue";



// REAKTIVE VARIABLER
const classesStore = useClassesStoreWater();
const error = ref(null);


// HENT DATA FRA STORE
onMounted(async () => {
  try {
    classesStore.fetchClasses();
  } catch (err) {
    error.value = "Beklager, der opstod en fejl under indlæsning af data.";
    console.error("Fejl under indlæsning af data:", err);
  };

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

</script>

<template>
    <main v-if="classesStore.isLoading" class="loading-container"><TheSpinner></TheSpinner></main>
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
      <TheInternNavWater></TheInternNavWater>

      <section>
        
          <TheFilterBar
            :labels="classesStore.availableCategories" :store="classesStore"
            :selectedCategory="classesStore.selectedCategory"
            @categorySelected="classesStore.setCategory"
          ></TheFilterBar>

        <section> 
          <h4>Holdbeskrivelser</h4>
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
                :link="{ name: 'holdbeskrivelse-motion', params: { id: klasse.id } }"
                :teamImage="getCoverImage(klasse)"
                :alt="klasse.coverbilledeAlt || ' Holdbillede'" 
              ></TheTeamCard>
            </div>
          </div>
        </section>
      </section>
    </main>
</template>

<style scoped>

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

section{
  width: 95%;
  max-width: var(--max-width);
  margin: 0 auto;
}



@media screen and (min-width: 768px) {

  .grid-container {
    grid-template-columns: repeat(3,1fr);
    max-width: var(--max-width);
    margin: 0 auto;
  }


}
  
</style>