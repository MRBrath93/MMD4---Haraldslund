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
const holdbeskrivelseImg = ref(null);
const isLoading = ref(true);
const error = ref(null);


// HENT DATA FRA STORE
onMounted(async () => {
  fetch ('https://popular-gift-b355856076.strapiapp.com/api/holdoversigt-motionscenter?pLevel')
  .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP fejl! Status: ${response.status}`);
      }
      return response.json();
    })    
    .then(data => {
        holdData.value = data.data;   
    })
    .catch(err => {
      error.value = err.message;
    })
    .finally(() => {
      isLoading.value = false;
    });
});


// funktion til at hente den bedste tilgængelige billed-URL fra et billede-objekt
function getImage(billede) {
  if (!billede || !billede.formats) return '';
  return billede.formats.large?.url ||
    billede.formats.medium?.url ||
    billede.formats.small?.url ||
    billede.formats.thumbnail?.url ||
    billede.url || '';
}

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
    <main v-if="isLoading">    
      <TheSpinner>
            <span class="material-icons">sports_gymnastics</span>
      </TheSpinner>
    </main>
    <main v-else-if="error">Der opstod en fejl: {{ error }}</main>
    <main v-else>
      <TheHero
        :title="holdData.Hero_sektion.Hero_titel_h5?.Titel_H5"
        :subtitle="holdData.Hero_sektion.Hero_undertitel_h6?.Undertitel_H6"
        description="Læs om vores udvalg af motionshold i motionscenter Haraldslund."
        :image="getImage(holdData.Hero_sektion?.Hero_Baggrundsbillede?.Billede[0])"
        :alt="holdData.Hero_sektion.Hero_Baggrundsbillede?.data?.attributes?.alternativeText || 'Hero billede'" />
  
      <TheBreadcrumb/>
      <TheInternNavMotion 
        :labels="internNavLabels" />

      <section v-for="afsnit in holdData.Indhold.Afsnit || []" :key="afsnit.id" >
        <h1>{{ afsnit.Titel }}</h1>
        <p></p>
      </section>
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
                :teamImage="getImage(klasse)"
                :alt="klasse.coverbilledeAlt || ' Holdbillede'" 
              />
            </div>          
          </div>
        </section>
      </section>

      <Reklamekort 
        :src="getImage(classesStore.reklame_kort.Billede) || '' " 
        :alt="classesStore.reklame_kort.Billede.alternativeText" 
        :title="classesStore.reklame_kort.Titel" 
        :text="classesStore.reklame_kort.Tekst_afsnit" 
        :Btn_title="classesStore.reklame_kort.Knapper[0].btn_titel" 
        :Btn_text="classesStore.reklame_kort.Knapper[0].btn_description" 
        :kategori="classesStore.reklame_kort.Kategori" 
        :Btn_icon="classesStore.reklame_kort.Knapper[0].Ikon[0]">
      </Reklamekort>
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