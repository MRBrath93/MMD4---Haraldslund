<script setup>
import imgMeet from '@/assets/images/2024-Haraldslund_Wellness_015.jpg'
import imgWell from '@/assets/images/2024-Haraldslund_Wellness_041.jpg'
import imgSvom from '@/assets/images/svomme.jpg'
import imgMot from '@/assets/images/motion.jpg'
import TheTeamCard from '@/components/TheTeamCard.vue'

import EntryPoint from '@/components/EntryPoint.vue';
import TheBtn from '@/components/TheBtn.vue';
import Reklamekort from '@/components/Reklamekort.vue';
import TheSpinner from '@/components/TheSpinner.vue';
import FrontpageTheHero from '@/components/FrontpageTheHero.vue';
import RushHoursHaraldslund from '@/components/RushHoursHaraldslund.vue';
import ImageHolder from '@/components/ImageHolder.vue';
import EventsCard from '@/components/EventsCard.vue';
import { ref, computed, onMounted } from 'vue';

const forsideData = ref(null);
const holdData = ref([]);

const isLoading = ref(true);
const error = ref(null);

const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutter cache

onMounted(async () => {
  isLoading.value = true;
  error.value = null;

  const cachedForsideRaw = localStorage.getItem('forsideData');
  const cachedHoldRaw = localStorage.getItem('holdData');
  const cachedTimestampRaw = localStorage.getItem('cacheTimestamp');
  const now = Date.now();

  if (cachedForsideRaw && cachedHoldRaw && cachedTimestampRaw) {
    const cachedTimestamp = Number(cachedTimestampRaw);

    if (now - cachedTimestamp < CACHE_DURATION_MS) {
      try {
        forsideData.value = JSON.parse(cachedForsideRaw);
        holdData.value = JSON.parse(cachedHoldRaw);
        isLoading.value = false;
        return;  // Brug cached data og undgå fetch
      } catch (e) {
        console.warn('Fejl ved parsing af cached data:', e);
        // Fald tilbage til fetch hvis cache er corrupt
      }
    }
  }

  // Hent data fra API
  try {
    const [forsideRes, motionsRes, vandsRes] = await Promise.all([
      fetch('https://popular-gift-b355856076.strapiapp.com/api/forside?pLevel'),
      fetch('https://popular-gift-b355856076.strapiapp.com/api/hold-motions?pLevel'),
      fetch('https://popular-gift-b355856076.strapiapp.com/api/hold-vands?pLevel')
    ]);

    if (!forsideRes.ok) throw new Error(`Forside fejl: ${forsideRes.status}`);
    if (!motionsRes.ok) throw new Error(`Hold motions fejl: ${motionsRes.status}`);
    if (!vandsRes.ok) throw new Error(`Hold vands fejl: ${vandsRes.status}`);

    const forsideJson = await forsideRes.json();
    const motionsJson = await motionsRes.json();
    const vandsJson = await vandsRes.json();

    forsideData.value = forsideJson.data;
    holdData.value = [...motionsJson.data, ...vandsJson.data];

    localStorage.setItem('forsideData', JSON.stringify(forsideData.value));
    localStorage.setItem('holdData', JSON.stringify(holdData.value));
    localStorage.setItem('cacheTimestamp', now.toString());

  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
});

function getImage(billede) {
  if (!billede || !billede.formats) return '';
  return billede.formats.large?.url ||
    billede.formats.medium?.url ||
    billede.formats.small?.url ||
    billede.formats.thumbnail?.url ||
    billede.url || '';
}

// Array med ugedagene som de er skrevet i dine data
const dageNavne = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
const iDag = new Date().getDay();
const dagensNavn = dageNavne[iDag];

// Filtreret holdData der kun indeholder hold for den aktuelle dag
const filteredHold = computed(() => {
  if (!selectedDate.value || !holdData.value.length) return [];

  const valgtDag = selectedDate.value;
  const valgtUgedag = dageNavne[valgtDag.getDay()].toLowerCase();
  const valgtDatoStr = valgtDag.toISOString().split('T')[0]; // YYYY-MM-DD

  const nu = new Date();
  const nuTid = nu.getHours().toString().padStart(2, '0') + ':' + nu.getMinutes().toString().padStart(2, '0');

  const result = [];

  holdData.value.forEach(hold => {
    (hold.Tidspunkter || []).forEach(t => {
      if (t.Ugedag?.toLowerCase() === valgtUgedag) {
        const tidHHmm = t.Tidspunkt.slice(0,5);

        const visDenne = valgtDatoStr !== nu.toISOString().split('T')[0] || tidHHmm >= nuTid;

        if (visDenne) {
          const kategoriStr = Array.isArray(hold.Traenings_kategorier) 
            ? hold.Traenings_kategorier.map(k => typeof k === 'string' ? k : k.Navn).join(', ') 
            : '';

          const lokationStr = Array.isArray(hold.Lokation) 
            ? hold.Lokation.map(l => typeof l === 'string' ? l : l.Navn).join(', ') 
            : '';

          result.push({
            id: hold.id + '-' + t.Tidspunkt,
            tidspunkt: t.Tidspunkt,
            aktivitet: hold.Titel,
            kategori: kategoriStr,
            lokation: lokationStr
          });
        }
      }
    });
  });

  return result.sort((a, b) => a.tidspunkt.localeCompare(b.tidspunkt));
});


function formatTime(timeString) {
  // Eksempel input: "12:45:00"
  // Returnerer kun "12:45"
  if (!timeString) return '';
  return timeString.slice(0, 5);
}

const selectedDate = ref(new Date()); // default: i dag

const kommendeDage = computed(() => {
  const dage = [];
  const idag = new Date();
  for (let i = 0; i < 7; i++) {
    const dato = new Date(idag);
    dato.setDate(dato.getDate() + i);
    dage.push(dato);
  }
  return dage;
});


function gåTilbage() {
  const iDag = new Date();
  iDag.setHours(0, 0, 0, 0); // Nulstil tid til midnat
  const valgtDato = new Date(selectedDate.value);
  valgtDato.setHours(0, 0, 0, 0);

  if (valgtDato > iDag) {
    selectedDate.value = new Date(selectedDate.value.getTime() - 24 * 60 * 60 * 1000);
  }
}


function gåFrem() {
  selectedDate.value = new Date(selectedDate.value.getTime() + 24 * 60 * 60 * 1000);
}

const erTidligereEndIDag = computed(() => {
  const iDag = new Date();
  iDag.setHours(0, 0, 0, 0);
  const valgt = new Date(selectedDate.value);
  valgt.setHours(0, 0, 0, 0);
  return valgt <= iDag;
});

</script>

<style scoped>
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
    max-width: 1432px;
    margin: 0 auto;
}

.two--column-grid{
    display: grid;
    grid-template-columns: repeat(1fr);
    grid-template-rows: repeat(2, 0.5fr);
    gap: 1rem;
    width: 95%;
    max-width: 1432px;
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
    max-width: 1432px;
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
  max-width: 1432px;
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

table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-text);
}

th, td{
    width: fit-content;
    padding: 10px;
    text-align: left;
    font-size: 12px;
}

table a {
    display: block;
    width: fit-content;
    text-align: left;
    font-size: 12px;
}

.hide{
    display: none;
}

th{
    border-bottom: 1px solid var(--color-activity-viewer-stroke);
}

th {
    background-color: var(--color-haraldslund-light);
}

tr:nth-child(even){
    background-color: var(--color-pricetable)
}

@media screen and (min-width: 500px) {
    .four--column-grid{
        gap: 1rem;
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

.dato-display {
  font-weight: bold;
  font-family: var(--font-text);
}

.date--picker{
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacer-x1);
    width: fit-content;
    background-color: var(--color-btn-primary);
    color: var(--color-font-1);
    border-radius: var(--border-radius);
    border: 1px solid var(--color-font-1);
}

.date--picker button.disabled {
  color: gray;
  cursor: not-allowed;
  opacity: 0.5;
}

.date--picker button {
    border: 1px solid transparent;
  background-color: transparent;
  color: var(--color-font-1);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  padding: 0;
}

.date--picker button:hover {
  background-color: var(--color-btn-primary-hover);
  color: var(--color-font-2);
  border: 1px solid var(--color-btn-primary-hover);
}

.date--picker .bold {
  font-weight: bold;
  text-align: start;
  font-size: 0.8rem;
  color: var(--color-font-1);
}

</style>

<template>
  <body>
    <main v-if="isLoading">
      <TheSpinner>
        <span class="material-icons">sports_gymnastics</span>
      </TheSpinner>
    </main>

    <main v-else-if="error">Der opstod en fejl: {{ error }}</main>

    <main v-else>
      <FrontpageTheHero
        :title="forsideData.Hero_sektion.Hero_titel_h5.Titel_H5"
        :subtitle="forsideData.Hero_sektion.Hero_undertitel_h6.Undertitel_H6"
        :image="forsideData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].url"
        :alt="forsideData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].alternativeText"
      ></FrontpageTheHero>

      <section
        class="textsection"
        v-for="tekstsektion in forsideData.Indhold.Afsnit"
        :key="tekstsektion.id"
      >
        <article class="flex--column flex1">
          <h1>{{ tekstsektion.Overskrift }}</h1>
          <div v-for="single_text in tekstsektion.Tekst || []" :key="single_text.id">
            <h5 class="subtitle" v-if="single_text.Underoverskift">{{ single_text.Underoverskift }}</h5>
            <ul class="punkt" v-if="single_text.Skal_det_punktopstilles">
              <li> {{ single_text.Brodtekst }}</li>
            </ul>
            <p v-else> {{ single_text.Brodtekst }}</p>
          </div>
          <div class="btn--container">
            <TheBtn
              v-for="btn in tekstsektion.Knapper"
              :key="btn.id"
              :title="btn.btn_titel"
              :text="btn.btn_description"
              :icon="btn.Ikon[0]"
            ></TheBtn>
          </div>
        </article>
        <div class="img--container flex1" v-for="billede in tekstsektion.Billede" :key="billede.id">
          <ImageHolder class="img" :src="getImage(billede)" :alt="billede.alternativeText" />
        </div>
      </section>

      <section>
        <h2 class="text-align-center">Udforsk vores tilbud</h2>
        <div class="four--column-grid">
          <EntryPoint icon="arrow_forward" color="blue" title="Svømmehal" :bgimage="imgSvom" name="svommehallen-vandogwellness" />
          <EntryPoint icon="arrow_forward" color="purple" title="Wellness" :bgimage="imgWell" name="vandogwellness" />
          <EntryPoint icon="arrow_forward" color="green" title="Motion" :bgimage="imgMot" name="motion" />
          <EntryPoint icon="arrow_forward" color="brown" title="Møder & Konferencer" :bgimage="imgMeet" name="moder-og-konferencer" />
        </div>
      </section>

      <section class="overview-container">
        <h2>Det sker i Haraldslund</h2>
        <div class="btn--container">
            <div class="date--picker">
                <button class="left" :class="{ disabled: erTidligereEndIDag }" @click="gåTilbage" :disabled="erTidligereEndIDag">
      <span class="material-symbols-rounded">chevron_left</span>
    </button>
    <p class="bold">{{ dageNavne[selectedDate.getDay()] }} d. {{ selectedDate.getDate() }}/{{ selectedDate.getMonth() + 1 }}</p>
      <button class="right" @click="gåFrem">
            <span class="material-symbols-rounded">chevron_right</span>
          </button>
            </div>
</div>

        <table>
            <thead>
                <tr>
                    <th>Tidspunkt</th>
                    <th>Aktivitet</th>
                    <th class="hide">Kategori</th>
                    <th>Sted</th>
                </tr>
            </thead>
            <tbody>
  <tr v-for="hold in filteredHold" :key="hold.id">
    <td>{{ formatTime(hold.tidspunkt) }}</td>
    <td><a href="">{{ hold.aktivitet }}</a></td>
    <td class="hide">{{ hold.kategori }}</td>
    <td>{{ hold.lokation }}</td>
  </tr>
  <tr v-if="filteredHold.length === 0">
    <td colspan="4" style="text-align: center; padding: 1rem;">
      Der er ingen hold resten af dagen.
    </td>
  </tr>
</tbody>
        </table>
        <RushHoursHaraldslund></RushHoursHaraldslund>
        <EventsCard></EventsCard>

    </section>
    <Reklamekort 
    :src="getImage(forsideData.reklame_kort.Billede)" 
    :alt="forsideData.reklame_kort.Billede.alternativeText" 
    :title="forsideData.reklame_kort.Titel" 
    :text="forsideData.reklame_kort.Tekst_afsnit" 
    :Btn_title="forsideData.reklame_kort.Knapper[0].btn_titel" 
    :Btn_text="forsideData.reklame_kort.Knapper[0].btn_description" 
    :kategori="forsideData.reklame_kort.Kategori" 
    :Btn_icon="forsideData.reklame_kort.Knapper[0].Ikon[0]"></Reklamekort>

    </main>
  </body>
</template>
