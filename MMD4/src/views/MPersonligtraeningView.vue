<script setup>
// IMPORTS 
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import TheInternNavMotion from "../components/TheInternNavMotion.vue";
import TheHero from "@/components/TheHero.vue";
import Reklamekort from "@/components/Reklamekort.vue";
import TheSpinner from "@/components/TheSpinner.vue";
import ImageHolder from "@/components/ImageHolder.vue";
import TheBtn from "@/components/TheBtn.vue";

import { ref, onMounted } from "vue";

// FETCH DATA FRA STRAPI
onMounted(() => {
  fetch('https://popular-gift-b355856076.strapiapp.com/api/personlig-traening-motionscenter?pLevel')
  .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP fejl! Status: ${response.status}`);
      }
      return response.json();
    })    
    .then(data => {
        personligTraening.value = data.data;   
    })
    .catch(err => {
      error.value = err.message;
    })
    .finally(() => {
      isLoading.value = false;
    });
});


// INTERN NAVIGATION LABELS (FRA STRAPI)
const internNavLabels = [
  { id: 1, label: "Om Motionscenteret", name: "om-motionscenteret" },
  { id: 2, label: "Holdoversigt", name: "holdoversigt-motionscenteret" },
  { id: 3, label: "Priser", name: "priser-motionscenteret" },
  { id: 4, label: "Regler", name: "regler-motionscenteret" },
  { id: 5, label: "Personlig træning", name: "personlig-traening-motionscenteret" },
  { id: 6, label: "Leje af sal & instruktør", name: "leje-af-sal-og-instruktor-motionscenteret" },
  { id: 7, label: "Sundhed & bevægelse", name: "sib-motionscenteret" },
];

// REAKTIVE VARIABLER
const personligTraening = ref(null);
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
      :title="personligTraening.Hero_sektion.Hero_titel_h5?.Titel_H5"
      :subtitle="personligTraening.Hero_sektion.Hero_undertitel_h6?.Undertitel_H6"
      description="Læs om personlig træning i motionscenter Haraldslund."
      :image="getImage(personligTraening.Hero_sektion?.Hero_Baggrundsbillede?.Billede[0])"
      :alt="personligTraening.Hero_sektion.Hero_Baggrundsbillede?.data?.attributes?.alternativeText || 'Hero billede'" />

    <TheBreadcrumb />  

    <TheInternNavMotion 
    :labels="internNavLabels" />
    <!-- <h1>{{ personligTraening.Titel }}</h1> -->
    <div id="wrapper-content">
      <div class="tekst-container">
        <section v-for="afsnit in personligTraening?.Indhold.Afsnit || []" :key="afsnit.id" class="afsnit-section" >
          <h2>{{ afsnit.Overskrift }}</h2>
          <div v-for="tekst in afsnit.Tekst || []" :key="tekst.id">
            <span v-if="tekst.Underoverskift">{{ tekst.Underoverskift }}</span>
            <span :class="tekst.Underoverskift ? 'fat-text' : ''">{{ tekst.Brodtekst }}</span>
          </div>
          <div v-if="afsnit.Knapper?.length > 0">
            <TheBtn
              v-for="btn in afsnit.Knapper || []"
              :key="btn.id"
              :link="btn.link_to"
              :title="btn.btn_titel"
              :text="btn.btn_description"
              :icon="btn.Ikon[0]">
            </TheBtn>
          </div>
      </section>
    </div>
    <aside class="billede-container" v-if="personligTraening?.Billede?.Billede_element">
      <ImageHolder
        v-for="billede in personligTraening.Billede.Billede_element"
        :key="billede?.id"
        class="side-img"
        :src="getImage(billede)"
        :alt="billede?.data?.attributes?.alternativeText || 'Billede'" />
    </aside>
  </div>
    <Reklamekort 
      :src="getImage(personligTraening.reklame_kort.Billede) || '' " 
      :alt="personligTraening.reklame_kort.Billede.alternativeText" 
      :title="personligTraening.reklame_kort.Titel" 
      :text="personligTraening.reklame_kort.Tekst_afsnit" 
      :Btn_title="personligTraening.reklame_kort.Knapper[0].btn_titel" 
      :Btn_text="personligTraening.reklame_kort.Knapper[0].btn_description" 
      :kategori="personligTraening.reklame_kort.Kategori" 
      :Btn_icon="personligTraening.reklame_kort.Knapper[0].Ikon[0]">
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


aside {
    max-width: 700px;
    max-height: 845px;
}

.afsnit-section div {
padding-bottom: var(--spacer-x0-25);
}

span {
  font-size: 1rem;
  line-height: 1.5;
  max-width: 75ch;
  font-family: var(--font-text);
  color: var(--color-font-1);
}

.button {
  margin: var(--spacer-x1-5) 0;
}

.tekst-container {
  display: flex;
  flex-direction: column; 
  gap: var(--spacer-x2);
  max-width: 650px;
}

p {
    padding-bottom: var(--spacer-x1);
}

.fat-text {
    font-weight: 700;
}

#wrapper-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 90vw;
  gap: var(--spacer-x2);
}

@media screen and (min-width: 768px) {
  #wrapper-content {
    flex-direction: row;
    gap: var(--spacer-x3);
  }
}

</style>