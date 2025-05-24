<script setup>
// IMPORTS 
import TheHero from "../components/TheHero.vue";
import TheInternNavMotion from "../components/TheInternNavMotion.vue";
import TheBreadcrumb from "../components/TheBreadcrumb.vue";
import EntryPoint from '@/components/EntryPoint.vue';
import ImageHolder from '@/components/ImageHolder.vue';
import TheSpinner from "@/components/TheSpinner.vue";
import { ref, onMounted, onUnmounted } from "vue";


// REAKTIVE VARIABLER
const motionViewData = ref(null);
const isLoading = ref(true);
const error = ref(null);

// Screen size check
const isScreenLarge = ref(false);

// CACHE VARIABLER
const CACHE_DURATION_MS = 5 * 60 * 1000;

checkScreenSize();


// FETCH DATA FRA LOCAL STORAGE 
onMounted(() => {
    window.addEventListener("resize", checkScreenSize);

    isLoading.value = true;
    error.value = null;
    const cachedMotionViewRaw = localStorage.getItem('motionViewData'); // Hent cached data
    const cachedTimestampRaw = localStorage.getItem('cacheTimestamp'); // Hent cached timestamp
    const now = Date.now();

    // CHECK CACHE
    if (cachedMotionViewRaw && cachedTimestampRaw) {
    const cachedTimestamp = Number(cachedTimestampRaw);
    if (now - cachedTimestamp < CACHE_DURATION_MS) {
        try {
        motionViewData.value = JSON.parse(cachedMotionViewRaw);
        isLoading.value = false;
        return;
        } catch (e) {
        console.warn('Fejl ved parsing af cached data:', e);
        }
    }
    }
    // FETCH DATA FRA STRAPI
    fetch('https://popular-gift-b355856076.strapiapp.com/api/motion?pLevel')
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP fejl! Status: ${response.status}`);
        }
        return response.json();
    })    
    .then(json => {
        motionViewData.value = json.data;
        localStorage.setItem('motionViewData', JSON.stringify(motionViewData.value));
        localStorage.setItem('cacheTimestamp', now.toString());
    })
    .catch(err => {
        error.value = err.message;
    })
    .finally(() => {
        isLoading.value = false;
    });
});

onUnmounted(() => {
    window.removeEventListener("resize", checkScreenSize);
});

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

function checkScreenSize() {
    isScreenLarge.value = window.innerWidth >= 768;   
}
// Denne funktion tjekker skærmstørrelsen og opdaterer isScreenLarge variablen. Når skærmen er bredere end 768px, sættes isScreenLarge til true. Det bruges til at bestemme, om billeder skal vises i TheEntryPoints eller ej.      
// INSPIRATIONSKILDE RESIZE: MDN Web Docs. Window: innerWidth property. Mozilla Foundation. 2025 (online). [Accessed 21/05/2025] URL: https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth

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
        :title="motionViewData.Hero_sektion.Hero_titel_h5?.Titel_H5"
        :subtitle="motionViewData.Hero_sektion.Hero_undertitel_h6?.Undertitel_H6"
        description="Læs om vores forskellige motionstilbud i Haraldslund."
        :image="getImage(motionViewData.Hero_sektion?.Hero_Baggrundsbillede?.Billede[0])"
        :alt="motionViewData.Hero_sektion.Hero_Baggrundsbillede?.data?.attributes?.alternativeText || 'Hero billede'" />
        <!-- KILDEREFERENCE BILLEDE: Seizinger, Corri. Fil #:745719113. Adobe Stock 2025. (online) [Accessed 07/05/2025] URL: https://stock.adobe.com/dk/search/images?filters%5Bcontent_type%3Aphoto%5D=1&filters%5Bcontent_type%3Aimage%5D=1&filters%5Borientation%5D=panoramic&filters%5Bcopy_space%5D=all&filters%5Bcontent_type%3Aillustration%5D=0&filters%5Bcontent_type%3Azip_vector%5D=0&k=styrketr%C3%A6ning&order=relevance&search_type=filter-select&limit=100&search_page=1&acp=&aco=styrketr%C3%A6ning&color=%23427A40&get_facets=1&asset_id=745719113 -->
        <div class="page-wrapper">
            <TheBreadcrumb />  
            <TheInternNavMotion 
            :labels="internNavLabels" />
            <section>
                <article v-for="afsnit in motionViewData.Indhold?.Afsnit || []" :key="afsnit.id"  class="flex-row-container">
                    <div class="flex-column-container">
                        <h1>{{ afsnit.Overskrift }}</h1>
                        <div v-for="tekst in afsnit.Tekst || []" :key="tekst.id">
                            <h2 v-if="tekst.Underoverskift">{{ tekst.Underoverskift }}</h2>
                            <p>{{ tekst.Brodtekst }}</p>
                        </div>
                    </div>
                    <aside v-if="afsnit.Billede" class="aside-image">
                        <ImageHolder
                        v-for="image in afsnit.Billede"
                        :key="image.id"
                        :src="getImage(image)"
                        :alt="image.alternativeText || 'Motionscenter billede'"
                        />
                    </aside>
                </article>
            </section> 
            
            <section class="entrypoints">
                <h2>Din tid, din træning - vælg det tilbud der passer dig</h2>
                <div class="card-container">
                    <EntryPoint v-for="card in motionViewData.Entrypoints" :key="card.id"
                        class="entrypoint" 
                        icon="arrow_forward" 
                        :color="card.Kategori" 
                        :title="card.label" 
                        :bgimage=" isScreenLarge ? getImage(card.billede) : '' "
                        :name="card.link_to">
                    </EntryPoint>
                </div>
                <!-- KILDEREFERENCE BILLEDE SUNDHED & BEVÆGELSE: Trautmann, Arne. billede: #12878928. (online) Colourbox.dk. 2025 [Accessed 07/05/2025] URL: https://www.colourbox.dk/billede/traening-senior-fysioterapi-billede-12878928 -->
        </section>  
        </div>
    </template>
</template>

<style scoped>

main{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.page-wrapper {
    display: flex;
    flex-direction: column;
    max-width: var(--max-width);
    width: 95%;
    margin: 0 auto;
}

.flex-row-container {
    margin: 0 auto var(--spacer-Elements);
}

.flex-column-container{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--spacer-x2);
}

.breadcrumb-container {
   margin: 0;
}

.aside-image{
    margin: 0 auto;
    padding-top: var(--spacer-x2);
    height: 35rem;
    display: flex;
    align-items: stretch;
}

.card-container{
    display: flex;
    flex-direction: column;
    gap: var(--spacer-x2);
    width: 100%;
    margin: 0 auto;
}

.entrypoints {
    text-align: center;
    margin-bottom: var(--spacer-Elements);
    width: 95%;
}

/* --- MEDIA QUERIES --- */

@media screen and (min-width: 768px) {

.card-container{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    height: auto;
}

.entrypoint {
    max-height: 20.6rem;
    aspect-ratio: 1 / 1;
  }

    .aside-image {
    height: 25rem;
    }
}

@media screen and (min-width: 1200px) {
    .flex-row-container{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        max-width: 1432px;
        max-height: 800px;
        gap: var(--spacer-x4);
    }

    .aside-image {
        height: 34rem;
    }
}

</style>