<script setup>
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import TheInternNavMotion from "../components/TheInternNavMotion.vue";
import TheHero from "@/components/TheHero.vue";
import ImageHolder from "@/components/ImageHolder.vue";
import Reklamekort from "@/components/Reklamekort.vue";

import { ref, onMounted } from "vue";


onMounted(() => {
  fetch('https://popular-gift-b355856076.strapiapp.com/api/motionscenter?pLevel')
  .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP fejl! Status: ${response.status}`);
      }
      return response.json();
    })    
    .then(data => {
        motionData.value = data.data;   
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

const motionData = ref(null);
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
    <main v-if="isLoading">Indlæser...</main>
    <main v-else-if="error">Der opstod en fejl: {{ error }}</main>
    <main v-else>
      <TheHero
        :title="motionData.Hero_sektion.Hero_titel_h5?.Titel_H5"
        :subtitle="motionData.Hero_sektion.Hero_undertitel_h6?.Undertitel_H6"
        description="Læs om vores moderne motionscenter."
        :image="getImage(motionData.Hero_sektion?.Hero_Baggrundsbillede?.Billede[0])"
        :alt="motionData.Hero_sektion.Hero_Baggrundsbillede?.data?.attributes?.alternativeText || 'Hero billede'" />
  
      <TheBreadcrumb />  
  
      <TheInternNavMotion :labels="internNavLabels" />
        <h1>{{ motionData.Titel }}</h1>
      <section v-for="afsnit in motionData.Indhold.Afsnit || []" :key="afsnit.id" >
        <h2>{{ afsnit.Overskrift }}</h2>
  
        <div class="tekst-section" v-for="afsnit in motionData.Indhold.Afsnit || []" :key="afsnit.id">
            <div v-for="tekst in afsnit.Tekst || []" :key="tekst.id">
                <p>{{ tekst.Brodtekst }}</p>
            </div>

        </div>
        <aside v-if="afsnit.Billede?.length == 1 ">
          <ImageHolder
            v-for="billede in afsnit.Billede"
            :key="billede.id"
            class="side-img"
            :src="getImage(billede)"
            :alt="billede?.data?.attributes?.alternativeText || 'Billede'" />
        </aside>
        <article class="gallery-grid" v-if="afsnit.Billede?.length > 1">
          <ImageHolder
            v-for="billede in afsnit.Billede"
            :key="billede.id"
            class="gallery-img"
            :src="getImage(billede)"
            :alt="billede?.data?.attributes?.alternativeText || 'Billede'" />
        </article>
      </section>

      <!-- <article>
        <Reklamekort
          :title="motionData.Reklamekort?.Titel"
          :subtitle="motionData.Reklamekort?.Undertitel"
          :image="getImage(motionData.Reklamekort?.Billede)"
          :alt="motionData.Reklamekort?.Billede?.data?.attributes?.alternativeText || 'Reklamekort billede'" />
      </article> -->
    </main>
  </template>
  

<style scoped>
main{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.tekst-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-x1);
    margin-bottom: var(--spacer-x2);
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: var(--spacer-x1);
    max-width: 1545px;
    margin: 0 auto;
    padding: var(--spacer-x1);
}

.side-img {
    max-width: 700px;
    max-height: 845px;
    object-fit: cover;
}

.gallery-img {
    max-width: 495px;
    max-height: 333px;
    object-fit: cover;
}

.gallery-img:nth-child(5) {
    grid-row: span 2;
    max-height: 674px;
}



</style>