<script setup>
// Import af genanvendelige komponenter
import DynamicHeading from '@/components/DynamicHeading.vue';
import EntryPoint from '@/components/EntryPoint.vue';
import TheBtn from '@/components/TheBtn.vue';
import Reklamekort from '@/components/Reklamekort.vue';
import TheSpinner from '@/components/TheSpinner.vue';
import FrontpageTheHero from '@/components/FrontpageTheHero.vue';
import RushHoursHaraldslund from '@/components/RushHoursHaraldslund.vue';
import ImageHolder from '@/components/ImageHolder.vue';
import LiveView from '@/components/LiveView.vue';
import EventsCard from '@/components/EventsCard.vue';

// Import af Vue's reaktive funktioner
import { ref, onMounted } from 'vue';

// Reaktive referencer til data, loading state og fejl
const forsideData = ref(null);
const isLoading = ref(true);
const error = ref(null);

// Definerer hvor længe cachede data skal være gyldige (1 time)
const CACHE_DURATION_MS = 60 * 60 * 1000;

// Funktion til at hente det mest passende billedformat.  Returnerer det bedst tilgængelige billedformat eller en tom streng, hvis ingen findes
function getImage(billede) {
  if (!billede || !billede.formats) return '';
  return billede.formats.large?.url ||
         billede.formats.medium?.url ||
         billede.formats.small?.url ||
         billede.formats.thumbnail?.url ||
         billede.url || '';
}

// Når komponenten er monteret...
onMounted(() => {
    // Henter det aktuelle tidspunkt
    const now = Date.now();

  // Forsøg at hente cachede data og timestamp
  const cachedData = localStorage.getItem('forsideData');
  const cachedTime = Number(localStorage.getItem('cachefrontpageTimestamp'));

  // Brug cache hvis den er valid/gældende
  if (cachedData && cachedTime && now - cachedTime < CACHE_DURATION_MS) {
    try {
        // omdanner cachede data og gemmer dem
        forsideData.value = JSON.parse(cachedData);
        // Stopper loading state
        isLoading.value = false;
        return;
    } catch (e) {
      console.warn('Fejl ved parsing af cache:', e);
    }
  }

  // Hent data fra Strapi hvis der ikke findes valid cache
  fetch('https://popular-gift-b355856076.strapiapp.com/api/forside?pLevel')
    .then(res => {
      if (!res.ok) throw new Error(`Forside fejl: ${res.status}`);
      return res.json();
    })
    .then(json => {
      forsideData.value = json.data;
      // Gem data og tidspunkt i localStorage
      localStorage.setItem('forsideData', JSON.stringify(json.data));
      localStorage.setItem('cachefrontpageTimestamp', now.toString());
    })
    .catch(err => {
      error.value = err.message;
    })
    .finally(() => {
      isLoading.value = false;
    });
});
</script>


<template>
    <!-- Vis spinner mens data hentes -->
    <div class="loading-container" v-if="isLoading">
        <TheSpinner>
            <span class="material-icons">sports_gymnastics</span>
        </TheSpinner>
    </div>

    <!-- Vis fejlbesked hvis datahentning fejler -->
    <div v-else-if="error">Der opstod en fejl: {{ error }}</div>

    <!-- Når data er hentet vises forsiden -->
    <div v-else>
        <!-- Hero-sektion med billede og tekst -->
        <FrontpageTheHero
            :title="forsideData.Hero_sektion.Hero_titel_h5.Titel_H5"
            :subtitle="forsideData.Hero_sektion.Hero_undertitel_h6.Undertitel_H6"
            :image="forsideData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].url"
            :alt="forsideData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].alternativeText"></FrontpageTheHero>

        <!-- Dynamisk tekstindhold med overskrifter, brødtekst, knapper og billeder -->
        <section class="textsection" v-for="(tekstsektion, index) in forsideData.Indhold.Afsnit" :key="tekstsektion.id">
            <article class="flex--column flex1">
                <!-- Dynamisk overskriftsniveau baseret på placering i listen. Hvis index er = 0 så skal den have en h1 ellers så skal den tage indexnr + 1. Men maks en 6 (h6) -->
                <DynamicHeading :level="index === 0 ? 1 : Math.min(index + 1, 6)">
                    {{ tekstsektion.Overskrift }}
                </DynamicHeading>

                <!-- Brødtekst med evt. underoverskrift og punktopstilling -->
                <div v-for="single_text in tekstsektion.Tekst || []" :key="single_text.id">
                    <h5 class="subtitle" v-if="single_text.Underoverskift">{{ single_text.Underoverskift }}</h5>
                    <ul class="punkt" v-if="single_text.Skal_det_punktopstilles">
                        <li>{{ single_text.Brodtekst }}</li>
                    </ul>
                    <p v-else>{{ single_text.Brodtekst }}</p>
                </div>

                <!-- Vis knapper hvis de findes og arraylængden er over 0 -->
                <div v-if="Array.isArray(tekstsektion.Knapper) && tekstsektion.Knapper.length > 0" class="btn--container">
                    <TheBtn
                        v-for="btn in tekstsektion.Knapper"
                        :key="btn.id"
                        :link="btn.link_to"
                        :title="btn.btn_titel"
                        :text="btn.btn_description"
                        :icon="btn.Ikon[0]"></TheBtn>
                </div>
            </article>

            <!-- Vis tilhørende billede -->
            <div class="img--container flex1" v-for="billede in tekstsektion.Billede" :key="billede.id">
                <ImageHolder class="img" :src="getImage(billede)" :alt="billede.alternativeText"></ImageHolder>
            </div>
        </section>

        <!-- Entrypoints: visuelle genveje til tilbud -->
        <section class="entrypoints">
            <h2 class="text-align-center">Udforsk vores tilbud</h2>
            <div class="card-container">
                <EntryPoint
                    v-for="card in forsideData.Entrypoints"
                    :key="card.id"
                    class="entrypoint"
                    icon="arrow_forward"
                    :color="card.Kategori"
                    :title="card.label"
                    :bgimage="getImage(card.billede)"
                    :name="card.link_to"></EntryPoint>
            </div>
        </section>  

        <!-- Sektion med live-aktivitetsvisning og events -->
        <section class="overview-container">
            <h2 id="live-view-heading">Det sker i Haraldslund</h2>
            <LiveView></LiveView>
            <RushHoursHaraldslund></RushHoursHaraldslund>
            <EventsCard></EventsCard>
        </section>

        <!-- Reklamekort nederst på siden -->
        <Reklamekort 
            :src="getImage(forsideData.reklame_kort.Billede)" 
            :alt="forsideData.reklame_kort.Billede.alternativeText" 
            :title="forsideData.reklame_kort.Titel" 
            :text="forsideData.reklame_kort.Tekst_afsnit" 
            :Btn_title="forsideData.reklame_kort.Knapper[0].btn_titel" 
            :Btn_text="forsideData.reklame_kort.Knapper[0].btn_description" 
            :kategori="forsideData.reklame_kort.Kategori" 
            :Btn_icon="forsideData.reklame_kort.Knapper[0].Ikon[0]"></Reklamekort>
    </div>
</template>




<style scoped>
.loading-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

main{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.four--column-grid{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    height: 400px;
    gap: 0.5rem;
    width:100%;
    max-width: var(--max-width);
    margin: 0 auto;
}

.two--column-grid{
    display: grid;
    grid-template-columns: repeat(1fr);
    grid-template-rows: repeat(2, 0.5fr);
    gap: 1rem;
    width: 95%;
    max-width: var(--max-width);
    margin: 50px auto;
}

.overview{
    grid-row: 1/-1;
}

.overview-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding:var(--spacer-x1);
    width: 95%;
    max-width: var(--max-width);
    background-color: var(--color-activity-viewer);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: var(--border-radius);
    margin: var(--spacer-Elements) auto;
}

.textsection {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-x2);
  margin: 0 auto var(--spacer-Elements);
  width: 95%;
  max-width: var(--max-width);
}

.img--container {
  flex: 1;
  display: flex;
}

.subtitle{
    margin-top: var(--spacer-x1);
}

.punkt{
    margin-inline-start: var(--spacer-x1);
}

.btn--container{
    display: flex;
    flex-direction: column;
    justify-content: left;
    gap: var(--spacer-x1);
    width: 100%;
    margin: var(--spacer-x1) 0;
}

.flex--column{
    display: flex;
    flex-direction: column;
    gap: var(--spacer-x1);
}

.flex1{
    flex: 1;
}

section{
    width: 95%;
    margin: 0 auto;
}

.text-align-center{
    text-align: center;
}

.hide{
    display: none;
}

.text-align-center{
    text-align: center;
}

.entrypoints{
    width: 95%;
}

.card-container{
    display: grid;
    grid-template-columns:1fr;
    gap: var(--spacer-x1);
    width: 100%;
    max-width: var(--max-width);
    margin: var(--spacer-x1) auto;
}

.entrypoint {
    width: 100%;
    height: 100%;
    min-height: 10rem;
}

@media screen and (min-width: 500px) {
    .card-container{
        grid-template-columns: repeat(2, 1fr);
    }

    .entrypoint{
        min-height: 200px;
    }
}

@media screen and (min-width: 1000px) {
    .card-container{
        grid-template-columns: repeat(4, 1fr);
    }

    .entrypoint{
        min-height: 300px;
    }
}


@media screen and (min-width: 500px) {
    .four--column-grid{
        gap: 1rem;
    }

    .btn--container{
        flex-direction: row;
    }
}

@media screen and (min-width: 600px) {
    .hide{
        display: table-cell;
    }

    th, td, table a{
        font-size: unset;
    }
}

@media screen and (min-width: 700px) {
    .two--column-grid{
        grid-template-columns: repeat(2,1fr);
    }
}

@media screen and (min-width: 800px) {
    .textsection{
        flex-direction: row;
    }

    .img--container{
        max-height: 400px;
    }
}

@media screen and (min-width: 1000px) {

    .four--column-grid{
        grid-template-columns: repeat(4,1fr);
        height: 300px;
    }

    .overview-container{
        padding:var(--spacer-x3) var(--spacer-x7);
    }
}

</style>