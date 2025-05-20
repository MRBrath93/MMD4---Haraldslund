<script setup>
// IMPORTS
import { ref, onMounted } from "vue";
import TheBtn from "@/components/TheBtn.vue";
import TheInternNavHaraldslund from "../components/TheInternNavHaraldslund.vue";
import TheBreadcrumb from "../components/TheBreadcrumb.vue";
import TheHero from "../components/TheHero.vue";
import TheSpinner from "../components/TheSpinner.vue";
import ImageHolder from "@/components/ImageHolder.vue";



// FETCH DATA
onMounted(() => {
  isLoading.value = true;
  error.value = null;

  const cachedPraktiskRaw = localStorage.getItem('praktiskData');
  const cachedTimestampRaw = localStorage.getItem('cacheTimestamp');
  const now = Date.now();

  if (cachedPraktiskRaw && cachedTimestampRaw) {
    const cachedTimestamp = Number(cachedTimestampRaw);

    if (now - cachedTimestamp < CACHE_DURATION_MS) {
      try {
        praktiskData.value = JSON.parse(cachedPraktiskRaw);
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
  fetch('https://popular-gift-b355856076.strapiapp.com/api/praktisk-information?pLevel')
  .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP fejl! Status: ${response.status}`);
      }
      return response.json();
    })    
    .then(json => {
        praktiskData.value = json.data;
        localStorage.setItem('praktiskData', JSON.stringify(praktiskData.value));
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
const praktiskData = ref(null);
const isLoading = ref(true);
const error = ref(null);

const CACHE_DURATION_MS = 5 * 60 * 1000;


// Intern navigation labels (fra Strapi)
const internNavLabels = [
{ id: 1, label: "Praktisk Information", name: "haraldslund-praktisk-info" },
{ id: 2, label: "Prisoversigt", name: "haraldslund-priser" },
{ id: 3, label: "Café Harald", name: "haraldslund-cafe" },
{ id: 4, label: "Personale", name: "haraldslund-personale" },
{ id: 5, label: "Historien", name: "haraldslund-historie" },
{ id: 6, label: "Bibliotek", name: "haraldslund-bibliotek" },
{ id: 7, label: "Firmaaftaler", name: "haraldslund-firmaaftaler" },
{ id: 8, label: "Brugerråd", name: "haraldslund-brugerraad" },
{ id: 9, label: "Events", name: "haraldslund-events" },
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
        :title="praktiskData.Hero_sektion.Hero_titel_h5?.Titel_H5"
        :subtitle="praktiskData.Hero_sektion.Hero_undertitel_h6?.Undertitel_H6"
        description="Læs praktisk information om Haraldslund Vand og Kulturhus"
        :image="getImage(praktiskData.Hero_sektion?.Hero_Baggrundsbillede?.Billede[0])"
        :alt="praktiskData.Hero_sektion.Hero_Baggrundsbillede?.data?.attributes?.alternativeText || 'Hero billede'" />
  
        <h1> {{ praktiskData.Titel }} </h1>
        <TheBreadcrumb />
        <TheInternNavHaraldslund
        :label="internNavLabels"
        />
        <div class="tekst-container">
            <div>
                <h2>Adresse</h2>
                <p>{{ praktiskData.Adresse }}</p>
            </div>
            <div>
                <h2>Telefonnummer</h2>
                <p>{{ praktiskData.Telefonnummer }}</p>
            </div>
            <div>
                <h2>Åbningstider</h2>
                <div v-for="aabningstider in praktiskData.Almene_aabningstider || []" :key="aabningstider.id" class="flex-row">
                    <p v-if="aabningstider.Dag">{{ aabningstider.Dag }}</p>
                    <span v-if="aabningstider.Har_Vi_Lukket  === true "> Lukket </span>
                    <div v-else-if="aabningstider.Har_Vi_Lukket  === false ">
                        <span v-if="aabningstider.Start_tidspunkt "> {{  aabningstider.Start_tidspunkt.split(':')[0] }}:{{ aabningstider.Start_tidspunkt.split(':')[1] }} - </span>
                        <span v-if="aabningstider.Slut_tidspunkt "> {{  aabningstider.Slut_tidspunkt.split(':')[0] }}:{{ aabningstider.Slut_tidspunkt.split(':')[1] }}</span>
                    </div>
                    <!-- INSPIRATIONSKILDE SPLIT: W3Schools.JavaScript String split(). 2025. [Accessed 20/05/25] (online) URL: https://www.w3schools.com/jsref/jsref_split.asp -->
                </div>
            </div>
            
            <section v-for="afsnit in praktiskData?.Afsnit || []" :key="afsnit.id" class="afsnit-section">
                <div class="flex-section">
                    <h2>{{ afsnit.Overskrift }}</h2>
                    <div v-for="tekst in afsnit.Tekst || []" :key="tekst.id">
                        <p v-if="tekst.Underoverskift" class="fat-text">{{ tekst.Underoverskift }}</p>
                        <p>{{ tekst.Brodtekst }}</p>
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
                </div>
                <aside v-if="afsnit.Billede?.length > 0">
                    <ImageHolder
                    v-for="billede in afsnit.Billede"
                    :key="billede?.id"
                    class="side-img"
                    :class="{ 'small-img': afsnit.id === 288 }"
                    :src="getImage(billede)"
                    :alt="billede?.data?.attributes?.alternativeText || 'Billede'" />
                </aside>
            </section>
           
        </div>
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
    max-width: 1432px;
}

.flex-row {
    display: flex;
    justify-content: space-between;
    gap: var(--spacer-x1);
    width: 45%;
}

.flex-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-x2);
    flex: 1;
}

.afsnit-section {
    display: flex;
    flex-direction: row;
    gap: var(--spacer-x3);
}

.flex-El{
    flex: 1;
}

aside {
    max-width: 43.75rem;
    max-height: 29.5rem;
    padding-bottom: var(--spacer-x1);
    flex: 1;
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
}

.fat-text {
    font-weight: 700;
}

:deep(.small-img) {
    max-height: 20rem;
}

@media screen and (min-width: 768px) {
  #wrapper-content {
    flex-direction: row;
    gap: var(--spacer-x3);
  }
}

</style>