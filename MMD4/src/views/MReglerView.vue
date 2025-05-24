<script setup>
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import TheInternNavMotion from "../components/TheInternNavMotion.vue";
import TheHero from "@/components/TheHero.vue";
import Reklamekort from "@/components/Reklamekort.vue";
import TheSpinner from "@/components/TheSpinner.vue";

import { ref, onMounted } from "vue";


onMounted(() => {
  fetch('https://popular-gift-b355856076.strapiapp.com/api/regler-motionscenter?pLevel')
  .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP fejl! Status: ${response.status}`);
      }
      return response.json();
    })    
    .then(data => {
        mReglerData.value = data.data;   
    })
    .catch(err => {
      error.value = err.message;
    })
    .finally(() => {
      isLoading.value = false;
    });
});


const internNavLabels = [
  { id: 1, label: "Om Motionscenteret", name: "om-motionscenteret" },
  { id: 2, label: "Holdoversigt", name: "holdoversigt-motionscenteret" },
  { id: 3, label: "Priser", name: "priser-motionscenteret" },
  { id: 4, label: "Regler", name: "regler-motionscenteret" },
  { id: 5, label: "Personlig træning", name: "personlig-traening-motionscenteret" },
  { id: 6, label: "Leje af sal & instruktør", name: "leje-af-sal-og-instruktor-motionscenteret" },
  { id: 7, label: "Sundhed & bevægelse", name: "sib-motionscenteret" },
];

const mReglerData = ref(null);
const isLoading = ref(true);
const error = ref(null);

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
    <template v-if="isLoading">        
        <TheSpinner>
            <span class="material-icons">sports_gymnastics</span>
        </TheSpinner>
    </template>
    <template v-else-if="error">Der opstod en fejl: {{ error }}</template>
    <template v-else>
        <TheHero
        :title="mReglerData.Hero_sektion.Hero_titel_h5?.Titel_H5"
        :subtitle="mReglerData.Hero_sektion.Hero_undertitel_h6?.Undertitel_H6"
        description="Læs om regler og retningslinjer for Haraldslunds motionscenter."
        :image="getImage(mReglerData.Hero_sektion?.Hero_Baggrundsbillede?.Billede[0])"
        :alt="mReglerData.Hero_sektion.Hero_Baggrundsbillede?.data?.attributes?.alternativeText || 'Hero billede'" />

        <TheBreadcrumb />  

        <TheInternNavMotion :labels="internNavLabels" />
        <div class="container-rules">
            <h1>{{ mReglerData.Titel }}</h1>
            <section v-for="afsnit in mReglerData.Indhold?.Afsnit || []" :key="afsnit.id" >
                <h2>{{ afsnit.Overskrift }}</h2>
                <div class="text-spacer" v-for="tekstafsnit in afsnit.Tekst || []" :key="tekstafsnit.id">
                    <h4 v-if="tekstafsnit.Underoverskift">{{ tekstafsnit.Underoverskift }}</h4>
                    <p>{{ tekstafsnit.Brodtekst }}</p>
                </div>
            </section>
            <Reklamekort 
                :src="getImage(mReglerData?.reklame_kort?.Billede) || '' " 
                :alt="mReglerData.reklame_kort.Billede.alternativeText" 
                :title="mReglerData.reklame_kort.Titel" 
                :text="mReglerData.reklame_kort.Tekst_afsnit" 
                :Btn_title="mReglerData.reklame_kort.Knapper[0].btn_titel" 
                :Btn_text="mReglerData.reklame_kort.Knapper[0].btn_description" 
                :kategori="mReglerData.reklame_kort.Kategori" 
                :Btn_icon="mReglerData.reklame_kort.Knapper[0].Ikon[0]">
            </Reklamekort>
        </div>
    </template>
</template>

<style scoped>
main{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacer-x3);
    justify-content: center;
    margin: 0 auto;
}

.container-rules {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--spacer-x2);
    max-width: 800px;
}

h4 {
    padding-top: var(--spacer-x0-5);
}

p {
    padding-bottom: var(--spacer-x1);
}


</style>