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

// Vi opretter nogle "reaktive" variabler, som kan ændre sig og opdatere vores side automatisk
// Holder data til forsiden
const forsideData = ref(null);
 // Holder data om hold/aktiviteter
const holdData = ref([]);
 // Holder styr på om data bliver hentet (loader)
const isLoading = ref(true);
// Holder eventuelle fejlmeddelelser
const error = ref(null);
// Hvor længe cachedata er gyldige (5 minutter)
const CACHE_DURATION_MS = 5 * 60 * 1000;




// Denne funktion kører, når viewet er færdig med at blive vist på siden
onMounted(async () => {
    // Sæt loading til sand, da vi starter datahentning
  isLoading.value = true;
  // Ryd evt. tidligere fejl
  error.value = null;

  // Prøv at hente data fra browserens lokale hukommelse (localStorage)
  const cachedForsideRaw = localStorage.getItem('forsideData');
  const cachedHoldRaw = localStorage.getItem('holdData');
  const cachedTimestampRaw = localStorage.getItem('cacheTimestamp');
  // Hent nuværende tidspunkt i millisekunder vha. date()
  const now = Date.now();

  // Tjek om vi har cachedata, og om de stadig er "friske"
  if (cachedForsideRaw && cachedHoldRaw && cachedTimestampRaw) {
    const cachedTimestamp = Number(cachedTimestampRaw);

    // Hvis vores timestamp for vores lagret data er mindre end XX min. (Har vi bestemt i vores const længere oppe) Da fortsæt
    if (now - cachedTimestamp < CACHE_DURATION_MS) {
      try {
        // Hvis cache er gyldig, så bruger den gemte data i stedet for at hente data igen
        forsideData.value = JSON.parse(cachedForsideRaw);
        holdData.value = JSON.parse(cachedHoldRaw);
        // Data er klar, stop loading
        isLoading.value = false;
        // Afslut funktionen, så vi ikke henter data fra API
        return;
      } catch (e) {
        console.warn('Fejl ved parsing af cached data:', e);
      }
    }
  }

  // Hvis vi ikke har cache, eller den er for gammel, så hent data fra API (serveren)
  try {
    // Hent alle data samtidigt for bedre performance (Vi henter forside data og alle hold)
    const [forsideRes, motionsRes, vandsRes] = await Promise.all([
      fetch('https://popular-gift-b355856076.strapiapp.com/api/forside?pLevel'),
      fetch('https://popular-gift-b355856076.strapiapp.com/api/hold-motions?pLevel'),
      fetch('https://popular-gift-b355856076.strapiapp.com/api/hold-vands?pLevel')
    ]);

    // Tjek at alle svar fra serveren er i orden.
    if (!forsideRes.ok) throw new Error(`Forside fejl: ${forsideRes.status}`);
    if (!motionsRes.ok) throw new Error(`Hold motions fejl: ${motionsRes.status}`);
    if (!vandsRes.ok) throw new Error(`Hold vands fejl: ${vandsRes.status}`);

    // Omform JSON-svar til JavaScript-objekter
    const forsideJson = await forsideRes.json();
    const motionsJson = await motionsRes.json();
    const vandsJson = await vandsRes.json();

    // Gem data i vores reaktive variabler
    forsideData.value = forsideJson.data;
     // Sammensæt motions- og vands-hold i en variable
    holdData.value = [...motionsJson.data, ...vandsJson.data];

    // Gem data i localStorage for at kunne bruge cache næste gang
    localStorage.setItem('forsideData', JSON.stringify(forsideData.value));
    localStorage.setItem('holdData', JSON.stringify(holdData.value));
    localStorage.setItem('cacheTimestamp', now.toString());

  } catch (err) {
    // Hvis der opstår fejl ved hentning, gem fejlmeddelelsen så vi kan vise den
    error.value = err.message;
  } finally {
    // Uanset om der var fejl eller ej, så stop loading når vi er færdige
    isLoading.value = false;
  }
});




////////// ------- Script for live-oversigt over hold ------- //////////

// Array med ugedagene på dansk, i samme rækkefølge som JavaScript's getDay() giver
const dageNavne = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
// Hent dagens ugedag (0-6)
const iDag = new Date().getDay();

// Computed property anvendes til automatisk at opdaterer listen af hold baseret på valgt dato
const filteredHold = computed(() => {
    // Hvis intet valgt eller data er tom returner et tomt array
  if (!selectedDate.value || !holdData.value.length) return [];


  // Den dag vi vil vise holdoversigten for
  const valgtDag = selectedDate.value;
  // Den ugedag som tekst (fx "mandag")
  const valgtUgedag = dageNavne[valgtDag.getDay()].toLowerCase();
   // Formater dato+tid til YYYY-MM-DD (Dvs vi beholder kun datoen og ikke hele valuen for ValgtDag som kunne se således ud (2025-05-17T12:34:56.789Z)) Vi deler strengen ved T og beholder kun dato.
  const valgtDatoStr = valgtDag.toISOString().split('T')[0];

  // Nuværende tidspunkt
  const nu = new Date();
//   Vi sørger for og gemmer vores tid i et format som altid består af 2 tal. Dvs. at hvis klokken er 9:15 så vil det nu stå som 09:15. Dette gælder for alle vores tal for tidspunkt. svs. både minutter og timer.
  const nuTid = nu.getHours().toString().padStart(2, '0') + ':' + nu.getMinutes().toString().padStart(2, '0');

  // Her gemmer vi de hold vi vil vise (anvendes senere)
  const result = [];

  // loop igennem alle hold i data
  holdData.value.forEach(hold => {
    // Tjek alle tidspunkter for det enkelte hold
    (hold.Tidspunkter || []).forEach(t => {
      // Tjek om holdets ugedag matcher den valgte ugedag
      if (t.Ugedag?.toLowerCase() === valgtUgedag) {
        // Tager kun klokkeslæt, fx "12:30" så vi kan sammenligne det med den nuværende tid.Det er holdets klokkeslæt. 
        const tidHHmm = t.Tidspunkt.slice(0,5);

        // hvis den valgte dato ikke er i dag ELLER hvis den valgte dato er i dag, men den givne tid (tidHHmm) er senere eller lig med nuværende tid (nuTid)
        const visDenne = valgtDatoStr !== nu.toISOString().split('T')[0] || tidHHmm >= nuTid;

        if (visDenne) {
          // Hent kategori-string samlet som en streng. Først tjekker vi om det er et array med isArray(). hvis det er et array så laver vi et nyt array med  map() hvor vi sørger for at alle kategorier er en string, hvis en kategori skulle være et objekt så gemmer vi den kategori som en string ud fra den value der ligger i kategori.Navn.
          const kategoriStr = Array.isArray(hold.Traenings_kategorier) 
            ? hold.Traenings_kategorier.map(kategori => typeof kategori === 'string' ? kategori : kategori.Navn).join(', ')
            // Hvis ikke det er et array så sætter vi kategoriStr til en tom string.
            : '';
            // Ovenstående gør at vi får vores array lavet om til en samlet string hvis dette er aktuelt. ["Yoga", "Welleness", "Svømning"] bliver således til "Yoga, Wellnes, Svømning"

          // Hent lokations-tekst samlet som en streng. Det samme sker med vores lokationer.
          const lokationStr = Array.isArray(hold.Lokation) 
            ? hold.Lokation.map(l => typeof l === 'string' ? l : l.Navn).join(', ') 
            : '';

          // Vi tilføjer holdet til resultatlisten med de oplysninger vi skal vise i tabellen
          result.push({
            id: hold.id + '-' + t.Tidspunkt,  // Unikt id
            tidspunkt: t.Tidspunkt,
            aktivitet: hold.Titel,
            kategori: kategoriStr,
            lokation: lokationStr
          });
        }
      }
    });
  });

  // Sortér resultat listen efter tidspunkt (stigende)
  return result.sort((a, b) => a.tidspunkt.localeCompare(b.tidspunkt));
});

// Funktion til at formatere tid som "HH:MM" fra fx "12:45:00". Anvendes i vores tabel.slice tager de første 4 tal.
function formatTime(timeString) {
  if (!timeString) return '';
  return timeString.slice(0, 5);
}






// Funktion til vores datovælger:
// Start med i dag som valgt dato
const selectedDate = ref(new Date());

// Funktion der flytter valgt dato en dag tilbage, men ikke før i dagsdato. Vi ønsker ikke at vise de hold der var dagen forinden dagsdato. 
function gåTilbage() {
  const iDag = new Date();
  // Sæt klokkeslæt til midnat for sammenligning
  iDag.setHours(0, 0, 0, 0);
  const valgtDato = new Date(selectedDate.value);
  valgtDato.setHours(0, 0, 0, 0);

  if (valgtDato > iDag) {
    // Flyt datoen en dag tilbage ved at trække en dag fra, med timer, minutter og det hele.
    selectedDate.value = new Date(selectedDate.value.getTime() - 24 * 60 * 60 * 1000);
  }
}

// Funktion der flytter valgt dato en dag frem
function gåFrem() {
  selectedDate.value = new Date(selectedDate.value.getTime() + 24 * 60 * 60 * 1000);
}

// Computed der fortæller, om den valgte dato er tidligere eller lig med i dag Bruges til at disable vores gåtilbage knap.
const erTidligereEndIDag = computed(() => {
  const iDag = new Date();
  iDag.setHours(0, 0, 0, 0);
  const valgt = new Date(selectedDate.value);
  valgt.setHours(0, 0, 0, 0);
  return valgt <= iDag;
});



// funktion til at hente den bedste tilgængelige billed-URL fra et billede-objekt
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
        :alt="forsideData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].alternativeText"></FrontpageTheHero>
        
        <section class="textsection" v-for="tekstsektion in forsideData.Indhold.Afsnit" :key="tekstsektion.id">
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
                    :icon="btn.Ikon[0]"></TheBtn>
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
                        <td colspan="4" style="text-align: center; padding: 1rem;">Der er ingen hold resten af dagen.</td>
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

</style>