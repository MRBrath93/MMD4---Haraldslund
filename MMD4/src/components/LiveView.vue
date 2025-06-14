<script setup>
import { ref, computed, onMounted } from 'vue';
import { nextTick } from 'vue';

const holdData = ref([]);
 // Holder styr på om data bliver hentet (loader)
const isLoading = ref(true);
// Holder eventuelle fejlmeddelelser
const error = ref(null);
// Hvor længe cachedata er gyldige (5 minutter)
const CACHE_DURATION_MS = 60 * 60 * 1000;
// Reference til dato-tekst i datovælgeren
const dateTextRef = ref(null);


function trimHoldData(holdListe) {
  return holdListe.map(hold => ({
    id: hold.id,
    Titel: hold.Titel,
    Tidspunkter: hold.Tidspunkter,
    Traenings_kategorier: hold.Traenings_kategorier,
    Lokation: hold.Lokation,
    Type: hold.Type
  }));
}



// Denne funktion kører, når viewet er færdig med at blive vist på siden
onMounted(async () => {
    // Sæt loading til sand, da vi starter datahentning
  isLoading.value = true;
  // Ryd evt. tidligere fejl
  error.value = null;

  // Prøv at hente data fra browserens lokale hukommelse (localStorage)
  const cachedHoldRaw = localStorage.getItem('holdData');
  const cachedTimestampRaw = localStorage.getItem('cacheTimestamp');
  // Hent nuværende tidspunkt i millisekunder vha. date()
  const now = Date.now();

  // Tjek om vi har cachedata, og om de stadig er "friske"
  if (cachedHoldRaw && cachedTimestampRaw) {
    const cachedTimestamp = Number(cachedTimestampRaw);

    // Hvis vores timestamp for vores lagret data er mindre end XX min. (Har vi bestemt i vores const længere oppe) Da fortsæt
    if (now - cachedTimestamp < CACHE_DURATION_MS) {
      try {
        // Hvis cache er gyldig, så bruger den gemte data i stedet for at hente data igen
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
    const [motionsRes, vandsRes] = await Promise.all([
      fetch('https://popular-gift-b355856076.strapiapp.com/api/hold-motions?pLevel'),
      fetch('https://popular-gift-b355856076.strapiapp.com/api/hold-vands?pLevel')
    ]);

    // Tjek at alle svar fra serveren er i orden.
    if (!motionsRes.ok) throw new Error(`Hold motions fejl: ${motionsRes.status}`);
    if (!vandsRes.ok) throw new Error(`Hold vands fejl: ${vandsRes.status}`);

    // Omform JSON-svar til JavaScript-objekter
    const motionsJson = await motionsRes.json();
    motionsJson.data.forEach(hold => {
      hold.Type = 'Motion'; // Tilføj type til motionshold 
    });

    const vandsJson = await vandsRes.json();
    vandsJson.data.forEach(hold => {
      hold.Type = 'Vand'; // Tilføj type til vands- og wellness-hold
    });

    // Sammensæt motions- og vands-hold i en variable
    const combinedHold = [...motionsJson.data, ...vandsJson.data];
    holdData.value = combinedHold;
     
    // Gem kun det nødvendige i localStorage
    localStorage.setItem('holdData', JSON.stringify(trimHoldData(combinedHold)));
    localStorage.setItem('cacheTimestamp', now.toString());
  
  } catch (err) {
    // Hvis der opstår fejl ved hentning, gem fejlmeddelelsen så vi kan vise den
    error.value = err.message;
  } finally {
    // Uanset om der var fejl eller ej, så stop loading når vi er færdige
    isLoading.value = false;
  }
});

// INSPIRATIONSKILDER LOCALSTORAGE + CACHE DATA + aync/await
// Steve Griffith - Prof3ssorSt3v3. How to Cache Data with LocalStorage. (online). Youtube 2025. [Accessed 20/05/2025] URL: https://www.youtube.com/watch?v=fe6rCk7a6u0
// Emma Delaney. Mastering JavaScript Caching: A Step-by-Step Guide to Efficiently Build and Optimize Your Cache. (online). Medium 2025. [Accessed 20/05/2025] URL: https://emma-delaney.medium.com/mastering-javascript-caching-a-step-by-step-guide-to-efficiently-build-and-optimize-your-cache-dee8fd96a34e
// MDN Web Docs. How to use promises. Asynchronous JavaScript. (online). MDN Web Docs 2025. Mozilla Foundation. [Accessed 20/05/2025] URL: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises



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
            lokation: lokationStr,
            type: hold.Type, // Tilføj type (Motion/Vand)
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
function gaaTilbage() {
  const iDag = new Date();
  // Sæt klokkeslæt til midnat for sammenligning
  iDag.setHours(0, 0, 0, 0);
  const valgtDato = new Date(selectedDate.value);
  valgtDato.setHours(0, 0, 0, 0);

  if (valgtDato > iDag) {
    // Flyt datoen en dag tilbage ved at trække en dag fra, med timer, minutter og det hele.
    selectedDate.value = new Date(selectedDate.value.getTime() - 24 * 60 * 60 * 1000);
          nextTick(() => {
      dateTextRef.value?.focus();
    });
  }
}

// Funktion der flytter valgt dato en dag frem
function gaaFrem() {
  selectedDate.value = new Date(selectedDate.value.getTime() + 24 * 60 * 60 * 1000);
      nextTick(() => {
      dateTextRef.value?.focus();
    });
}

// Computed der fortæller, om den valgte dato er tidligere eller lig med i dag Bruges til at disable vores gaaTilbage knap.
const erTidligereEndIDag = computed(() => {
  const iDag = new Date();
  iDag.setHours(0, 0, 0, 0);
  const valgt = new Date(selectedDate.value);
  valgt.setHours(0, 0, 0, 0);
  return valgt <= iDag;
});


//  -- LINK TIL HOLDBESKRIVELSE I LIVEVIEW --
// const getRouteForHold tager et hold-objekt som parameter og returnerer et computed link til holdbeskrivelsen
// computed bruges til at opdatere linket automatisk, når hold ændres
// routeName afhænger af holdets type (Motion eller Vand), og params indeholder holdets id (begge fra hold-objektet).
// I funktionen undersøges holdets type. Hvis det er et motionshold, sættes ruten til 'holdbeskrivelse-motion', ellers sættes den til 'holdbeskrivelse-vandogwellness'.
// når objektet returneres, splittes id ved bindestregen, så vi kun får det første segment. Det gør vi for at undgå at have tid med i vores id, da det ikke er nødvendigt for ruten.
const getRouteForHold = (hold) => {
  return computed(() => {
  
    const routeName = hold.type === 'Motion'
      ? 'holdbeskrivelse-motion'
      : 'holdbeskrivelse-vandogwellness'
    return { name: routeName, params: { id: hold.id.split('-')[0] } }
  })
}


</script>

<template>
<span 
class="overview-wrapper"
>
            <div class="btn--container">
                <div class="date--picker">
                    <button 
                    class="left" 
                    :class="{ disabled: erTidligereEndIDag }" 
                    @click="gaaTilbage" 
                    :disabled="erTidligereEndIDag"
                    role="button"
                    :aria-label="'Gå til dagen før: ' + dageNavne[selectedDate.getDay()] + ' den ' + selectedDate.getDate() + '/' + (selectedDate.getMonth() + 1)"
                    :aria-disabled="erTidligereEndIDag.toString()"
                    >
                        <i class="material-symbols-rounded" aria-hidden="true">chevron_left</i>
                    </button>
                    <div class="date-picker-status"
                    ref="dateTextRef"
                    tabindex="0"
                    role="status"
                    :aria-label="'Holdvisning for ' + dageNavne[selectedDate.getDay()] + ' den ' + selectedDate.getDate() + '/' + (selectedDate.getMonth() + 1)">
                    
                    {{ dageNavne[selectedDate.getDay()] }} <abbr title="den">d.</abbr> {{ selectedDate.getDate() }}/{{ selectedDate.getMonth() + 1 }}
                    </div>
                    <button class="right" 
                    @click="gaaFrem"
                    role="button"
                    :aria-label="'Gå til dagen efter: ' + dageNavne[selectedDate.getDay()] + ' den ' + selectedDate.getDate() + '/' + (selectedDate.getMonth() + 1)"
                    >
                        <i class="material-symbols-rounded" aria-hidden="true">chevron_right</i>
                    </button>
                </div>
            </div>
            
            <table
            aria-live="polite"
            :aria-busy="isLoading"
            >
                <caption class="sr-only" tabindex="0">Aktivitetsoversigt for {{ dageNavne[selectedDate.getDay()] }} den {{ selectedDate.getDate() }}/{{ selectedDate.getMonth() + 1 }}</caption>
                <thead>
                    <tr>
                        <th scope="col">Tidspunkt</th>
                        <th scope="col">Aktivitet</th>
                        <th class="hide" scope="col">Kategori</th>
                        <th scope="col">Sted</th>
                    </tr>
                </thead>
                <tbody>
                  <tr v-if="isLoading">
                    <td 
                    colspan="4" 
                    class="text-center"
                    aria-label="Henter holdoversigt"
                    aria-live="polite"
                    >
                      <span class="dot-container" aria-hidden="true">
                        Henter hold 
                        <div class="drip-dots">
                          <span class="dot"></span>
                          <span class="dot"></span>
                          <span class="dot"></span>
                        </div> 
                      </span>
           
                    </td>
                  </tr>
                  <tr v-else-if="error">
                    <td 
                    colspan="4" 
                    class="text-center"
                    aria-label="Der opstod en fejl ved hentning af holdoversigt"
                    aria-live="assertive"
                    role="alert">
                    Der opstod en fejl: {{ error }}
                    </td>
                  </tr>
                  <tr v-else-if="filteredHold.length === 0">
                    <td colspan="4" 
                    class="text-center" 
                    aria-label="Der er ingen hold for den valgte dato"
                    aria-live="polite">
                    Der er ingen hold resten af dagen.</td>
                  </tr>
                  <tr v-else v-for="hold in filteredHold" 
                  :key="hold.id"
                  aria-label="Holdoversigt for {{ hold.aktivitet }} kl. {{ formatTime(hold.tidspunkt) }}"
                  role="row"
                  >
                    <td
                    role="cell"
                    aria-label="Tidspunkt for hold">
                    {{ formatTime(hold.tidspunkt) }}</td>
                    <td
                    role="cell"
                    aria-label="Aktivitet">
                      <router-link
                        :to="getRouteForHold(hold).value"
                        :aria-label="`Se beskrivelse for ${hold.aktivitet}`"
                      >
                        {{ hold.aktivitet }}
                      </router-link>
                    </td>
                    <td 
                    role="cell"
                    aria-label="Kategori for hold"
                    class="hide">{{ hold.kategori }}</td>
                    <td
                    role="cell"
                    aria-label="Lokation for hold"
                    >{{ hold.lokation }}</td>
                  </tr>
                </tbody>
            </table>
</span>
</template>



<style scoped>

.text-center {
    text-align: center;
    padding: var(--spacer-x1);
}

.drip-dots {
  display: flex;
  gap: 0.5rem;
  height: 2rem;
  padding: var(--spacer-x0-5);
}

.dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  background: var(--color-font-1);
  border-radius: 50%;
  animation: drip 1.2s infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}

.dot-container {
  display: flex;
  justify-content: center;
}

.overview-wrapper{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: var(--max-width);
    background-color: var(--color-activity-viewer);
}

abbr {
    text-decoration: none;
}

.btn--container{
    display: flex;
    justify-content: left;
    gap: var(--spacer-x1);
    width: 100%;
    margin: var(--spacer-x1) 0;
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
    color: var(--color-font-1);
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

.sr-only {
  position: absolute !important;
  clip: rect(0, 0, 0, 0);
  width: 1px; 
  height: 1px;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
}

th, td{
    border-bottom: 1px solid var(--color-activity-viewer-stroke);
}

th {
    background-color: var(--color-pricetable);
    border-bottom: 2px solid var(--color-activity-viewer-stroke);

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
  padding: 10px 15px;
}

.date--picker button:hover {
  background-color: var(--color-btn-primary-hover);
  color: var(--color-font-2);
  border: 1px solid var(--color-btn-primary-hover);
}

.date-picker-status {
  font-weight: bold;
  text-align: start;
  font-size: 0.8rem;
  color: var(--color-font-1);
  font-family: var(--font-text);
}



@keyframes drip {
  0%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(1.2em);
  }
  60% {
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dot {
    animation: none;
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

@media screen and (min-width: 1000px) {
    .overview-container{
        padding:var(--spacer-x3) var(--spacer-x7);
    }
}

</style>