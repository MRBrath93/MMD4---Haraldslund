<script setup>
import { ref, onMounted } from "vue";
import TheHero from "../components/TheHero.vue";
import TheInternNavMotion from "../components/TheInternNavMotion.vue";
import TheBreadcrumb from "../components/TheBreadcrumb.vue";
import ImageHolder from "@/components/ImageHolder.vue";
import Reklamekort from "@/components/Reklamekort.vue";
import TheSpinner from "../components/TheSpinner.vue";
import TheBtn from "@/components/TheBtn.vue";


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
    <main v-if="isLoading">        
        <TheSpinner>
            <span class="material-icons">sports_gymnastics</span>
        </TheSpinner>
    </main>
    <main v-else-if="error">Der opstod en fejl: {{ error }}</main>
    <main v-else>
      <TheHero
        :title="lejeData.Hero_sektion.Hero_titel_h5?.Titel_H5"
        :subtitle="lejeData.Hero_sektion.Hero_undertitel_h6?.Undertitel_H6"
        description="Læs om leje af motionshal og instruktør."
        :image="getImage(lejeData.Hero_sektion?.Hero_Baggrundsbillede?.Billede[0])"
        :alt="lejeData.Hero_sektion.Hero_Baggrundsbillede?.data?.attributes?.alternativeText || 'Hero billede'" />
  
      <TheBreadcrumb />  
  
      <!-- <h1>{{ lejeData.Titel }}</h1> -->
      <TheInternNavMotion 
      :labels="internNavLabels" />
           
        <section v-for="afsnit in lejeData?.Indhold.Afsnit || []" :key="afsnit.id">
            <h2>{{ afsnit.Overskrift }}</h2>
            <div class="flex-section" v-for="tekst in afsnit.Tekst || []" :key="tekst.id">
                <p v-if="tekst.Underoverskift">{{ tekst.Underoverskift }}</p>
                <p>{{ tekst.Brodtekst }}</p>
                <div v-if="afsnit === lejeData?.Indhold.Afsnit[1]">
                    <p class="fat-text" v-if="tekst.Brodtekst2">{{ tekst.Brodtekst2 }}</p>
                    <p v-if="tekst.Brodtekst2">{{ tekst.Brodtekst2 }}</p>
            
                </div>
            </div>
          
            <aside class="flex-section" v-for="billede in afsnit.Billede" :key="billede.id">
                <ImageHolder
                :key="billede.id"
                class="side-img"
                :src="getImage(billede)"
                :alt="billede?.data?.attributes?.alternativeText || 'Billede'" />
            </aside>
            
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


        <Reklamekort 
        :src="getImage(lejeData.reklame_kort.Billede)" 
        :alt="lejeData.reklame_kort.Billede.alternativeText" 
        :title="lejeData.reklame_kort.Titel" 
        :text="lejeData.reklame_kort.Tekst_afsnit" 
        :Btn_title="lejeData.reklame_kort.Knapper[0].btn_titel" 
        :Btn_text="lejeData.reklame_kort.Knapper[0].btn_description" 
        :kategori="lejeData.reklame_kort.Kategori" 
        :Btn_icon="lejeData.reklame_kort.Knapper[0].Ikon[0]"></Reklamekort>

    </main>
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


aside {
    max-width: 700px;
    max-height: 845px;
}

p {
    padding-bottom: var(--spacer-x1);
}



</style>