<script setup>
import { ref } from "vue";
import TheHero from "../components/TheHero.vue";
import TheInternNavMotion from "../components/TheInternNavMotion.vue";
import TheBreadcrumb from "../components/TheBreadcrumb.vue";
import ImageHolder from "@/components/ImageHolder.vue";
import Reklamekort from "@/components/Reklamekort.vue";

onMounted(() => {
  fetch('https://popular-gift-b355856076.strapiapp.com/api/leje-af-sal-og-instruktor-motionscenter?pLevel')
  .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP fejl! Status: ${response.status}`);
      }
      return response.json();
    })    
    .then(data => {
        lejeData.value = data.data;   
    })
    .catch(err => {
      error.value = err.message;
    })
    .finally(() => {
      isLoading.value = false;
    });

});

const lejeData = ref(null);
const isLoading = ref(true);
const error = ref(null);

const internNavLabels = [
  { id: 1, label: "Om Motionscenteret", name: "om-motionscenteret" },
  { id: 2, label: "Holdoversigt", name: "holdoversigt-motionscenteret" },
  { id: 3, label: "Priser", name: "priser-motionscenteret" },
  { id: 4, label: "Regler", name: "regler-motionscenteret" },
  { id: 5, label: "Personlig træning", name: "personlig-traening-motionscenteret" },
  { id: 6, label: "Leje af sal & instruktør", name: "leje-af-sal-og-instruktor-motionscenteret" },
  { id: 7, label: "Sundhed & bevægelse", name: "sib-motionscenteret" },
];

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
    <main>
        <TheHero
        :title="lejeData.Hero_sektion.Hero_titel_h5?.Titel_H5"
        :subtitle="lejeData.Hero_sektion.Hero_undertitel_h6?.Undertitel_H6"
        description="Læs om leje af motionshal og instruktør."
        :image="getImage(lejeData.Hero_sektion.Hero_Baggrundsbillede)"
        :alt="lejeData.Hero_sektion.Hero_Baggrundsbillede?.data?.attributes?.alternativeText || 'Hero billede'" />
  
        <TheBreadcrumb/>
        <h1>{{ lejeData.Hero_sektion.Hero_undertitel_h6?.Undertitel_H6 }}</h1>
        <TheInternNavMotion 
        :labels="internNavLabels" />

        <section>
            <p> {{ lejeData.Indhold.Afsnit.Tekst.Brodtekst }}</p>
            <ImageHolder
            v-for="billede in lejeData"
            :key="billede.id"
            :src="getImage(billede)"
            :alt="billede?.data?.attributes?.alternativeText || 'Billede'" />
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
</style>