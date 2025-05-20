<script setup>
// IMPORTS
import { ref, onMounted } from "vue";
import TheHero from "../components/TheHero.vue";
import TheInternNavMotion from "../components/TheInternNavMotion.vue";
import TheBreadcrumb from "../components/TheBreadcrumb.vue";
import ImageHolder from "@/components/ImageHolder.vue";
import Reklamekort from "@/components/Reklamekort.vue";
import TheSpinner from "../components/TheSpinner.vue";
import TheBtn from "@/components/TheBtn.vue";


// FETCH DATA
onMounted(() => {
  isLoading.value = true;
  error.value = null;

  const cachedLejeRaw = localStorage.getItem('lejeData');
  const cachedTimestampRaw = localStorage.getItem('cacheTimestamp');
  const now = Date.now();

  if (cachedLejeRaw && cachedTimestampRaw) {
    const cachedTimestamp = Number(cachedTimestampRaw);

    if (now - cachedTimestamp < CACHE_DURATION_MS) {
      try {
        lejeData.value = JSON.parse(cachedLejeRaw);
        isLoading.value = false;
        return;
      } catch (e) {
        console.warn('Fejl ved parsing af cached data:', e);
      }
    }
  }
  // Hvis cached data ikke findes eller er forældet, hent data fra Strapi
  // og gem det i localStorage
  // og opdater timestamp
  fetch('https://popular-gift-b355856076.strapiapp.com/api/leje-af-sal-og-instruktor-motionscenter?pLevel')
  .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP fejl! Status: ${response.status}`);
      }
      return response.json();
    })    
    .then(json => {
        lejeData.value = json.data;
        localStorage.setItem('lejeData', JSON.stringify(lejeData.value));
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
const lejeData = ref(null);
const isLoading = ref(true);
const error = ref(null);

const CACHE_DURATION_MS = 5 * 60 * 1000;


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
        :title="lejeData.Hero_sektion.Hero_titel_h5?.Titel_H5"
        :subtitle="lejeData.Hero_sektion.Hero_undertitel_h6?.Undertitel_H6"
        description="Læs om leje af motionshal og instruktør."
        :image="getImage(lejeData.Hero_sektion?.Hero_Baggrundsbillede?.Billede[0])"
        :alt="lejeData.Hero_sektion.Hero_Baggrundsbillede?.data?.attributes?.alternativeText || 'Hero billede'" />
  
      <TheBreadcrumb />  
  
      <!-- <h1>{{ lejeData.Titel }}</h1> -->
      <TheInternNavMotion 
      :labels="internNavLabels" />
      <div id="wrapper-content">
        <div class="tekst-container">
            <section v-for="afsnit in lejeData?.Indhold.Afsnit || []" :key="afsnit.id" class="afsnit-section">
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
        <aside class="billede-container" v-if="lejeData?.Billede?.Billede_element">
          <ImageHolder
            v-for="billede in lejeData.Billede.Billede_element"
            :key="billede?.id"
            class="side-img"
            :src="getImage(billede)"
            :alt="billede?.data?.attributes?.alternativeText || 'Billede'" />
        </aside>
      </div>
      <Reklamekort 
        :src="getImage(lejeData.reklame_kort.Billede)" 
        :alt="lejeData.reklame_kort.Billede.alternativeText" 
        :title="lejeData.reklame_kort.Titel" 
        :text="lejeData.reklame_kort.Tekst_afsnit" 
        :Btn_title="lejeData.reklame_kort.Knapper[0].btn_titel" 
        :Btn_text="lejeData.reklame_kort.Knapper[0].btn_description" 
        :kategori="lejeData.reklame_kort.Kategori" 
        :Btn_icon="lejeData.reklame_kort.Knapper[0].Ikon[0]">
      </Reklamekort>
    </main>
</template>

<style scoped>
main{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacer-x2);
    justify-content: center;
    margin: 0 auto;
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