<script setup>
// IMPORTS

import TheBreadcrumb from "../components/TheBreadcrumb.vue";
import TheInternNavHaraldslund from "../components/TheInternNavHaraldslund.vue";
import TheHero from "../components/TheHero.vue";
import { ref, onMounted, onUnmounted } from "vue";
import TheSpinner from "../components/TheSpinner.vue";
import Reklamekort from "@/components/Reklamekort.vue";

// REAKTIVE VARIABLER
const isLoading = ref(true);
const error = ref(null);
const motionPrisData = ref(null);
const vwPrisData = ref(null);
const kombiData = ref(null);
const aboutData = ref([]);

// CACHE VARIABLER
const CACHE_DURATION_MS = 60 * 60 * 1000;

// FETCH DATA
onMounted(() => {
    window.addEventListener('resize', handleResize);

    isLoading.value = true;
    error.value = null;

    const cachedvwPriserRaw = localStorage.getItem('vwPrisData');
    const cachedMotionPriserRaw = localStorage.getItem('motionPrisData');
    const cachedKombiPriserRaw = localStorage.getItem('kombiData');
    const cachedaboutRaw = localStorage.getItem('aboutData');
    const cachedTimestampRaw = localStorage.getItem('cacheHaraldslundPriserTimestamp');
    const now = Date.now();
   
    if (cachedvwPriserRaw && cachedMotionPriserRaw && cachedKombiPriserRaw && cachedaboutRaw && cachedTimestampRaw) {
        const cachedTimestamp = Number(cachedTimestampRaw);

        if (now - cachedTimestamp < CACHE_DURATION_MS) {
        try {
            vwPrisData.value = JSON.parse(cachedvwPriserRaw);
            motionPrisData.value = JSON.parse(cachedMotionPriserRaw);
            kombiData.value = JSON.parse(cachedKombiPriserRaw);
            aboutData.value = JSON.parse(cachedaboutRaw);
            isLoading.value = false;
            return;
        } catch (e) {
            console.warn('Fejl ved parsing af cached data:', e);
        }
        }
    }

    Promise.all([
        // Fetch data fra Strapi
        fetch('https://popular-gift-b355856076.strapiapp.com/api/priser-motion?pLevel'),
        fetch('https://popular-gift-b355856076.strapiapp.com/api/priser?pLevel'), 
        fetch('https://popular-gift-b355856076.strapiapp.com/api/priser-kombi?pLevel'),
        fetch('https://popular-gift-b355856076.strapiapp.com/api/om-haraldslund?pLevel')
    ])
        .then(async ([resMotion, resVW, resAbout, resKombi]) => {
        if (!resMotion.ok || !resVW.ok || !resAbout || !resKombi.ok) {
            throw new Error(`Fejl ved fetch: ${resMotion.status} / ${resVW.status} / ${resAbout.status} / ${resKombi.status}`);
        }
        const [motionJson, vwJson, aboutJson, kombiJson] = await Promise.all([
            resMotion.json(), 
            resVW.json(),
            resKombi.json(),
            resAbout.json()
        ]);
        
        motionPrisData.value = motionJson.data;
        vwPrisData.value = vwJson.data;
        kombiData.value = kombiJson.data;
        aboutData.value = aboutJson.data;

        // Gem data i localStorage
        localStorage.setItem('aboutData', JSON.stringify(aboutData.value));
        localStorage.setItem('motionPrisData', JSON.stringify(motionPrisData.value));
        localStorage.setItem('vwPrisData', JSON.stringify(vwPrisData.value));
        localStorage.setItem('kombiData', JSON.stringify(kombiData.value));
        // Gem timestamp i localStorage for at holde styr på, hvornår data blev hentet sidst
        localStorage.setItem('cacheHaraldslundPriserTimestamp', now.toString());
        })
        .catch(err => {
        error.value = err.message;
        })
        .finally(() => {
        isLoading.value = false;
        });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  handleResize(); // Kaldes her for at sikre korrekt initialisering af isMobile
});

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
  { id: 10, label: "Aktivitetsoversigt", name: "haraldslund-aktivitetsoversigt" },
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

const isMobile = ref(window.innerWidth < 600);

function handleResize() {
  isMobile.value = window.innerWidth < 600;
}

</script>


<template>
    <div class="loading-container" v-if="isLoading">
        <TheSpinner>
            <span class="material-icons">sports_gymnastics</span>
        </TheSpinner>
    </div>
    <div v-else-if="error">Der opstod en fejl: {{ error }}</div>
    <div v-else>
        <TheHero

        :title="aboutData.Hero_sektion.Hero_titel_h5.Titel_H5"
        :subtitle="aboutData.Hero_sektion.Hero_undertitel_h6.Undertitel_H6"
        :image="aboutData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].url"
        :alt="aboutData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].alternativeText"></TheHero>

        <div class="breadwrapper">
            <TheBreadcrumb></TheBreadcrumb>
        </div>

        <TheInternNavHaraldslund
        :label="internNavLabels"
        ></TheInternNavHaraldslund>
        <h1>Prisoversigt</h1>
        <section v-if="!isMobile">
        <!-- Tilføjet role="table" for at hjælpe evt. skærmlæsere eller anden teknologi med at identificere tabellen -->
            <h2 class="tabel-headline">Priser for kombinerede billetter</h2>
            <table role="table">
            <!-- KOMBINEREDE BILLETPRISER -->
                <caption class="screenreaders-only">Priser for kombinerede billetter</caption>
                <!-- --- ENKELTBILLETTER --- -->
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th scope="col" class="type">Enkelt billetter</th>
                        <th scope="col">Voksen</th>
                        <th scope="col">Barn<br>(3-14 år)</th>
                        <th scope="col">Pensionist</th>
                        <th scope="col">Studerende<br>(Studiekort skal forvises)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="kombiPris in kombiData?.Enkeltbillet_kombi || []" :key="kombiPris.id">
                        <td>{{ kombiPris.Ankomsttidspunkt }}</td>
                        <td>{{ kombiPris.Pris_voksen ? kombiPris.Pris_voksen + ',-' : '' }}</td>
                        <td>{{ kombiPris.Pris_barn ? kombiPris.Pris_barn + ',-' : '' }}</td>
                        <td>{{ kombiPris.Pris_pensionist ? kombiPris.Pris_pensionist + ',-' : '' }}</td>
                        <td>{{ kombiPris.Pris_studerende ? kombiPris.Pris_studerende + ',-' : '' }}</td>
                    </tr>
                    <!-- Der anvendes operatoren optional chaining (?.) for at undgå fejl, hvis værdien ikke findes og for at effektivisere.
                    Fx. "?.Pris" vil kun returnere prisen, hvis "KombiPris" arrayet indeholder en værdi for den givne "Genstand".
                    INSPIRATIONSKILDE: MDN Web Docs. Optional chaining (?.). (online) Mozilla Foundation. [Accessed 22/05/2025] URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
                    -->
                </tbody>
                <!-- --- KLIPPEKORT --- -->
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th class="type" scope="col">Klippekort <span class="th-small"> Ankomst før kl. 14:00 /<br>Ankomst efter kl. 14:00</span></th>
                        <th scope="col">Voksen</th>
                        <th scope="col">Barn<br>(3-14 år)</th>
                        <th scope="col">Pensionist</th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="kombiKlip in kombiData?.Klippekort_Kombi || []" :key="kombiKlip.id">
                        <td>{{ kombiKlip.Antal_klip }} </td>
                        <td>{{ kombiKlip.voksen.Pris_for_1400 ? kombiKlip.voksen.Pris_for_1400 + ',-' : '' }} / {{ kombiKlip.voksen.Pris_efter_1400 ? kombiKlip.voksen.Pris_efter_1400 + ',-' : '' }}</td>
                        <td>{{ kombiKlip.Barn.Pris_for_1400 ? kombiKlip.Barn.Pris_for_1400 + ',-' : '' }} / {{ kombiKlip.Barn.Pris_efter_1400 ? kombiKlip.Barn.Pris_efter_1400 + ',-' : '' }}</td>
                        <td>{{ kombiKlip.Pensionist.Pris_for_1400 ? kombiKlip.Pensionist.Pris_for_1400 + ',-' : '' }} / {{ kombiKlip.Pensionist.Pris_efter_1400 ? kombiKlip.Pensionist.Pris_efter_1400 + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                </tbody>
              </table>
 
            <!-- VAND OG WELLNESS PRISER -->
                <h2 class="tabel-headline">Priser for Vand & Wellness</h2>
                <table role="table">
                <!-- Tilføjet caption for at give skærmlæsere en beskrivelse af, hvad tabellen handler om -->
                <caption class="screenreaders-only">Priser på billetter i Vand og Wellness</caption>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th scope="col" class="type">Enkelt billetter</th>
                        <th scope="col">Voksen</th>
                        <th scope="col">Barn<br>(3-14 år)</th>
                        <th scope="col">Pensionist</th>
                        <th scope="col">Studerende<br>(Studiekort skal forvises)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vwPrisData?.Enkelt_Billetter || []" :key="pris.id">
                        <td>{{ pris.Ankomsttidspunkt }}</td>
                        <td>{{ pris.Pris_voksen ? pris.Pris_voksen + ',-' : '' }}</td>
                        <td>{{ pris.Pris_barn ? pris.Pris_barn + ',-' : '' }}</td>
                        <td>{{ pris.Pris_pensionist ? pris.Pris_pensionist + ',-' : '' }}</td>
                        <td>{{ pris.Pris_studerende ? pris.Pris_studerende + ',-' : '' }}</td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th scope="col" class="type">Familie billetter</th>
                        <th scope="col">1 Voksen</th>
                        <th scope="col">2 Voksne</th>
                        <th scope="col" aria-hidden="true"></th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vwPrisData?.Familiebilletter || []" :key="pris.id">
                        <td>{{ pris.Antal_born }} {{ Number(pris.Antal_born) === 1 ? 'barn' : 'børn' }}</td>
                        <td>{{ pris.Pris_1_voksen ? pris.Pris_1_voksen + ',-' : '' }}</td>
                        <td>{{ pris.Pris_2_voksne ? pris.Pris_2_voksne + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                        <td aria-hidden="true"></td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th class="type" scope="col">Klippekort <span class="th-small">Ankomst før kl. 14:00 /<br>Ankomst efter kl. 14:00 </span></th>
                        <th scope="col">Voksen</th>
                        <th scope="col">Barn<br>(3-14 år)</th>
                        <th scope="col">Pensionist</th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vwPrisData?.Klippekort || []" :key="pris.id">
                        <td>{{ pris.Antal_klip }} Klip</td>
                        <td>{{ pris.voksen.Pris_for_1400 ? pris.voksen.Pris_for_1400 + ',-' : '' }} / {{ pris.voksen.Pris_efter_1400 ? pris.voksen.Pris_efter_1400 + ',-' : '' }}</td>
                        <td>{{ pris.Barn.Pris_for_1400 ? pris.Barn.Pris_for_1400 + ',-' : '' }} / {{ pris.Barn.Pris_efter_1400 ? pris.Barn.Pris_efter_1400 + ',-' : '' }}</td>
                        <td>{{ pris.Pensionist.Pris_for_1400 ? pris.Pensionist.Pris_for_1400 + ',-' : '' }} / {{ pris.Pensionist.Pris_efter_1400 ? pris.Pensionist.Pris_efter_1400 + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th scope="col" class="type">Diverse billetter</th>
                        <th scope="col">1 Person</th>
                        <th scope="col">2 Personer</th>
                        <th scope="col">3 Personer</th>
                        <th scope="col">4 Personer</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vwPrisData?.Diverse_biletter || []" :key="pris.id">
                        <td>{{ pris.Titel_paa_billettype }}</td>
                        <td>{{ pris.pris_1_person ? 'Entre + ' + pris.pris_1_person + ',-' : '' }}</td>
                        <td>{{ pris.pris_2_personer ? 'Entre + ' + pris.pris_2_personer + ',-' : '' }}</td>
                        <td>{{ pris.pris_3_personer ? 'Entre + ' + pris.pris_3_personer + ',-' : '' }}</td>
                        <td>{{ pris.pris_4_personer ? 'Entre + ' + pris.pris_4_personer + ',-' : '' }}</td>
                    </tr>
                </tbody>

                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th scope="col" class="type">Personlig træner</th>
                        <th scope="col">25 minutter</th>
                        <th scope="col">5 x 25 minutter</th>
                        <th scope="col" aria-hidden="true"></th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vwPrisData.personlig_svommetraening" :key="pris.id">
                        <td>{{ pris.Titel_paa_billettype }}</td>
                        <td>{{ pris.pris_25_minutter ? 'Entre + ' + pris.pris_25_minutter + ',-' : '' }}</td>
                        <td>{{ pris.pris_5x25_minutter ? 'Entre + ' + pris.pris_5x25_minutter + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                        <td aria-hidden="true"></td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th class="type" scope="col">Massage</th>
                        <th scope="col" aria-hidden="true"></th>
                        <th scope="col" aria-hidden="true"></th>
                        <th scope="col" aria-hidden="true"></th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vwPrisData?.Massage || []" :key="pris.id">
                        <td>{{ pris.Titel_paa_billettype }}</td>
                        <td><p class="time">30 minutter</p>{{ pris.pris_30_minutter ? pris.pris_30_minutter + ',-' : '' }}</td>
                        <td><p class="time">45 minutter</p>{{ pris.pris_45_minutter ? pris.pris_45_minutter + ',-' : '' }}</td>
                        <td><p class="time">60 minutter</p>{{ pris.pris_60_minutter ? pris.pris_60_minutter + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                    <tr>
                        <td>Cupping</td>
                        <td><p class="time"><abbr title="Inklusiv">Inkl.</abbr> i massage</p>+{{ vwPrisData.Cupping?.pris_inklusiv_massage ? vwPrisData.Cupping.pris_inklusiv_massage + ',-' : '' }}</td>
                        <td><p class="time"><abbr title="Eksklusiv">Ekskl.</abbr> massage</p>{{vwPrisData.Cupping?.pris_ekslusiv_massage ? vwPrisData.Cupping.pris_ekslusiv_massage + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                        <td aria-hidden="true"></td>
                    </tr>
                </tbody>
            </table>
      
        <!-- MOTION PRISER -->
        <h2 class="tabel-headline">Priser for Motionscenter</h2>
  
            <table>
            <caption class="screenreaders-only">Priser for Motioncenter</caption>
            <thead>
                <tr>
                    <th scope="col" class="type">Enkelt billetter</th>
                    <th scope="col">Voksen</th>
                    <th scope="col">Studerende<br><small>(Studiekort skal forvises)</small></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="enkeltbillet in motionPrisData?.Enkeltbilletter || []" :key="enkeltbillet.id">
                <td>{{ enkeltbillet.Titel }} <span v-if="enkeltbillet.Note">{{ enkeltbillet.Note }}</span></td>
                <td>
                    {{ enkeltbillet.Priser.find(p => p.Genstand === 'Voksen')?.Pris }}{{ enkeltbillet.Priser.find(p => p.Genstand === 'Voksen') ? ',-' : '' }}
                </td>
                <td>
                    {{ enkeltbillet.Priser.find(p => p.Genstand === 'Studerende')?.Pris }}{{ enkeltbillet.Priser.find(p => p.Genstand === 'Studerende') ? ',-' : '' }}
                </td>
                </tr>
                <!-- I ovenstående kode er der tilføjet en betingelse for at vise prisen kun hvis den findes. 
                    "Priser" er et array, der indeholder objekter med "Genstand" og "Pris". Javascript: "find()" metoden bruges til at finde det objekt, der matcher den ønskede "Genstand".
                 Javascript operatoren "?." bruges til at undgå fejl, hvis værdien ikke findes.
                 "?.Pris" vil kun returnere prisen, hvis "Priser" arrayet indeholder en værdi for den givne "Genstand".
                 Hvis prisen ikke findes, vil den returnere "undefined", og det vil ikke blive vist i tabellen.
                INSPIRATIONSKILDE: 
                MDN WEB DOCS. Array.prototype.find(). 2025 (online) Mozilla Foundation 2025. [Accessed 21/05/2025] URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
                Evan You. List Rendering. (online) Vue.Js. 2025. [Accessed 22/05/2025] URL: https://vuejs.org/guide/essentials/list.html
                 -->     
            </tbody>

            <!-- --- KLIPPEKORT ---  -->
            <thead>
                <tr>
                    <th class="type" scope="col">Klippekort</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="klip in motionPrisData?.Klippekort || []" :key="klip.id">
                    <td>{{ klip.Titel + ' ' + klip.Note }}</td>
                    <td>{{ klip.Priser.find(p => p.Genstand === 'Voksen')?.Pris }}{{ klip.Priser.find(p => p.Genstand === 'Voksen') ? ',-' : '' }}</td>
                    <td>{{ klip.Priser.find(p => p.Genstand === 'Studerende')?.Pris }}{{ klip.Priser.find(p => p.Genstand === 'Studerende') ? ',-' : '' }}</td>
                </tr>
            </tbody>

            <!-- --- MÅNEDSKORT --- -->
            <thead>
                <tr>
                    <th class="type" scope="col">Månedskort</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="maenedskort in motionPrisData?.Maenedskort || []" :key="maenedskort.id">
                    <td>{{ maenedskort.Titel }} {{ maenedskort.Note }}</td>
                    <td>{{ maenedskort.Priser.find(p => p.Genstand === 'Voksen')?.Pris }}{{ maenedskort.Priser.find(p => p.Genstand === 'Voksen') ? ',-' : '' }}</td>
                    <td>{{ maenedskort.Priser.find(p => p.Genstand === 'Studerende')?.Pris }}{{ maenedskort.Priser.find(p => p.Genstand === 'Studerende') ? ',-' : '' }}</td>
                </tr> 
                <tr>
                    <td colspan="3" class="note">* Gælder 30 dage fra købsdato, med adgang til bad og omklædning (Kortet gælder ikke til  svømmehal).  
                    Kan anvendes 1 gang dagligt og er kun til personligt brug. Holdtræning Inkluderet.</td>
                </tr>
                
            </tbody>
            <!-- --- PERSONLIG TRÆNING --- -->
            <thead>
                <tr>
                    <th class="type" scope="col">Personlig træning</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="ptraening in motionPrisData?.Personlig_traening || []" :key="ptraening.id">
                    <td>{{ ptraening.Titel }} {{ ptraening.Note }}</td>
                    <td>{{ ptraening.Priser.find(p => p.Genstand === 'Voksen')?.Pris }}{{ ptraening.Priser.find(p => p.Genstand === 'Voksen') ? ',-' : '' }}</td>
                    <td>{{ ptraening.Priser.find(p => p.Genstand === 'Studerende')?.Pris }}{{ ptraening.Priser.find(p => p.Genstand === 'Studerende') ? ',-' : '' }}</td>
                </tr>
            </tbody>

            <!-- --- PROGRAMLÆGNING --- -->
            <thead>
                <tr>
                    <th class="type" scope="col">Programlægning</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="programlaegning in motionPrisData?.Programlaegning || []" :key="programlaegning.id">
                    <td>{{ programlaegning.Titel }} {{ programlaegning.Note }}</td>
                    <td>{{ programlaegning.Priser.find(p => p.Genstand === 'Voksen')?.Pris }}{{ programlaegning.Priser.find(p => p.Genstand === 'Voksen') ? ',-' : '' }}</td>
                    <td>{{ programlaegning.Priser.find(p => p.Genstand === 'Studerende')?.Pris }}{{ programlaegning.Priser.find(p => p.Genstand === 'Studerende') ? ',-' : '' }}</td>
                </tr>
            </tbody>
        </table>
        </section>
        <section v-if="isMobile">
            <h2 class="tabel-headline">Priser for kombinerede billetter</h2>
            <table role="table">
            <!-- KOMBINEREDE BILLETPRISER -->
                <caption class="screenreaders-only">Priser for kombinerede billetter</caption>
                <!-- --- ENKELTBILLETTER --- -->
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr>
                        <th scope="col">Enkelt billetter</th>
                        <th scope="col" v-for="kombiPris in kombiData?.Enkeltbillet_kombi || []" :key="kombiPris.id">{{ kombiPris.Ankomsttidspunkt }}</th>
                        <th scope="col" aria-hidden="true"></th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Voksen</td>
                        <td v-for="kombiPris in kombiData?.Enkeltbillet_kombi || []" :key="kombiPris.id">{{ kombiPris.Pris_voksen ? kombiPris.Pris_voksen + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                        <td aria-hidden="true"></td>
                    </tr>
                    <tr>
                        <td>Barn<br>(3-14 år)</td>
                        <td v-for="kombiPris in kombiData?.Enkeltbillet_kombi || []" :key="kombiPris.id">{{ kombiPris.Pris_barn ? kombiPris.Pris_barn + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                        <td aria-hidden="true"></td>
                    </tr>
                    <tr>
                        <td>Pensionist</td>
                        <td v-for="kombiPris in kombiData?.Enkeltbillet_kombi || []" :key="kombiPris.id">{{ kombiPris.Pris_pensionist ? kombiPris.Pris_pensionist + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                        <td aria-hidden="true"></td>
                    </tr>
                    <tr>
                        <td>Studerende<br>(Studiekort skal forvises)</td>
                        <td v-for="kombiPris in kombiData?.Enkeltbillet_kombi || []" :key="kombiPris.id">{{ kombiPris.Pris_studerende ? kombiPris.Pris_studerende + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                        <td aria-hidden="true"></td>
                    </tr>
                </tbody>
                <!-- --- KLIPPEKORT --- -->
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr>
                        <th scope="col">Klippekort</th>
                        <th scope="col">Voksen</th>
                        <th scope="col">Barn<br>(3-14 år)</th>
                        <th scope="col">Pensionist</th>
                        <th scope="col" aria-hidden="true"></th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="kombiKlip in kombiData?.Klippekort_Kombi || []"  :key="kombiKlip.id">
                        <td>{{ kombiKlip.Antal_klip }} Klip</td>
                        <td>{{ kombiKlip.voksen.Pris_for_1400 ? kombiKlip.voksen.Pris_for_1400 + ',-' : '' }} / {{ kombiKlip.voksen.Pris_efter_1400 ? kombiKlip.voksen.Pris_efter_1400 + ',-' : '' }}</td>
                        <td>{{ kombiKlip.Barn.Pris_for_1400 ? kombiKlip.Barn.Pris_for_1400 + ',-' : '' }} / {{ kombiKlip.Barn.Pris_efter_1400 ? kombiKlip.Barn.Pris_efter_1400 + ',-' : '' }}</td>
                        <td>{{ kombiKlip.Pensionist.Pris_for_1400 ? kombiKlip.Pensionist.Pris_for_1400 + ',-' : '' }} / {{ kombiKlip.Pensionist.Pris_efter_1400 ? kombiKlip.Pensionist.Pris_efter_1400 + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                    <tr>
                        <td colspan="5"> *Ankomst før kl. 14:00 / Ankomst efter kl. 14:00</td>
                    </tr>
                    <!-- INSPIRATIONSKILDE- COLSPAN: W3Schools. HTML Table Colspan & Rowspan. (online) W3.CSS,  Refsnes Data. [Accessed 21/05/2025] URL: https://www.w3schools.com/html/html_table_colspan_rowspan.asp -->
                </tbody>
              </table>
 
            <!-- VAND OG WELLNESS PRISER -->
                <h2 class="tabel-headline">Priser for Vand & Wellness</h2>
                <table role="table">
                <!-- Tilføjet caption for at give skærmlæsere en beskrivelse af, hvad tabellen handler om -->
                <caption class="screenreaders-only">Priser på billetter i Vand og Wellness</caption>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr>
                        <th scope="col">Enkelt billetter</th>
                        <th scope="col" v-for="pris in vwPrisData?.Enkelt_Billetter || []" :key="pris.id">{{ pris.Ankomsttidspunkt }}</th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                     <tr>
                        <td>Voksen</td>
                        <td v-for="pris in vwPrisData?.Enkelt_Billetter || []" :key="pris.id">{{ pris.Pris_voksen ? pris.Pris_voksen + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                    <tr>
                        <td>Barn<br>(3-14 år)</td>
                        <td v-for="pris in vwPrisData?.Enkelt_Billetter || []" :key="pris.id">{{ pris.Pris_barn ? pris.Pris_barn + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                    <tr>
                        <td>Pensionist</td>
                        <td v-for="pris in vwPrisData?.Enkelt_Billetter || []" :key="pris.id">{{ pris.Pris_pensionist ? pris.Pris_pensionist + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                    <tr>
                        <td>Studerende<br>(Studiekort skal forvises)</td>
                        <td v-for="pris in vwPrisData?.Enkelt_Billetter || []" :key="pris.id">{{ pris.Pris_studerende ? pris.Pris_studerende + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th scope="col">Familie billetter</th>
                        <th scope="col">1 Voksen</th>
                        <th scope="col">2 Voksne</th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vwPrisData?.Familiebilletter || []" :key="pris.id">
                        <td>{{ pris.Antal_born }} {{ Number(pris.Antal_born) === 1 ? 'barn' : 'børn' }}</td>
                        <td>{{ pris.Pris_1_voksen ? pris.Pris_1_voksen + ',-' : '' }}</td>
                        <td>{{ pris.Pris_2_voksne ? pris.Pris_2_voksne + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr>
                        <th scope="col">Klippekort <span class="th-small"> Ankomst før kl. 14:00 /<br>Ankomst efter kl. 14:00</span></th>
                        <th scope="col">Voksen</th>
                        <th scope="col">Barn<br>(3-14 år)</th>
                        <th scope="col">Pensionist</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vwPrisData?.Klippekort || []" :key="pris.id">
                        <td>{{ pris.Antal_klip }} Klip</td>
                        <td>{{ pris.voksen.Pris_for_1400 ? pris.voksen.Pris_for_1400 + ',-' : '' }} / {{ pris.voksen.Pris_efter_1400 ? pris.voksen.Pris_efter_1400 + ',-' : '' }}</td>
                        <td>{{ pris.Barn.Pris_for_1400 ? pris.Barn.Pris_for_1400 + ',-' : '' }} / {{ pris.Barn.Pris_efter_1400 ? pris.Barn.Pris_efter_1400 + ',-' : '' }}</td>
                        <td>{{ pris.Pensionist.Pris_for_1400 ? pris.Pensionist.Pris_for_1400 + ',-' : '' }} / {{ pris.Pensionist.Pris_efter_1400 ? pris.Pensionist.Pris_efter_1400 + ',-' : '' }}</td>
                    </tr>
                    <tr v-if="vwPrisData.Klippekort">
                        <td colspan="4"> *Ankomst før kl. 14:00 / Ankomst efter kl. 14:00</td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr>
                        <th scope="col">Diverse billetter</th>
                        <th scope="col" v-for="pris in vwPrisData?.Diverse_biletter || []" :key="pris.id">{{ pris.Titel_paa_billettype }}</th>
                    </tr>
                </thead>
                <tbody>
                   <tr>
                        <td>1 Voksen</td>
                        <td v-for="pris in vwPrisData?.Diverse_biletter || []" :key="pris.id">{{ pris.pris_1_person ? 'Entre + ' + pris.pris_1_person + ',-' : '' }}</td>
                    </tr>
                    <tr>
                        <td>2 Voksne</td>
                        <td v-for="pris in vwPrisData?.Diverse_biletter || []" :key="pris.id">{{ pris.pris_2_personer ? 'Entre + ' + pris.pris_2_personer + ',-' : '' }}</td>
                    </tr>
                    <tr>
                        <td>3 Voksne</td>
                        <td v-for="pris in vwPrisData?.Diverse_biletter || []" :key="pris.id">{{ pris.pris_3_personer ? 'Entre + ' + pris.pris_3_personer + ',-' : '' }}</td>
                    </tr>
                    <tr>
                        <td>4 Voksne</td>
                        <td v-for="pris in vwPrisData?.Diverse_biletter || []" :key="pris.id">{{ pris.pris_4_personer ? 'Entre + ' + pris.pris_4_personer + ',-' : '' }}</td>
                    </tr>
                </tbody>

                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr>
                        <th scope="col">Personlig træner</th>
                        <th scope="col">25 minutter</th>
                        <th scope="col">5 x 25 minutter</th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vwPrisData?.personlig_svommetraening || []" :key="pris.id">
                        <td>{{ pris.Titel_paa_billettype }}</td>
                        <td>{{ pris.pris_25_minutter ? 'Entre + ' + pris.pris_25_minutter + ',-' : '' }}</td>
                        <td>{{ pris.pris_5x25_minutter ? 'Entre + ' + pris.pris_5x25_minutter + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr>
                        <th scope="col">Massage</th>
                        <th scope="col" aria-hidden="true"></th>
                        <th scope="col" aria-hidden="true"></th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vwPrisData?.Massage || []" :key="pris.id">
                        <td>{{ pris.Titel_paa_billettype }}</td>
                        <td><p class="time">30 minutter</p>{{ pris.pris_30_minutter ? pris.pris_30_minutter + ',-' : '' }}</td>
                        <td><p class="time">45 minutter</p>{{ pris.pris_45_minutter ? pris.pris_45_minutter + ',-' : '' }}</td>
                        <td><p class="time">60 minutter</p>{{ pris.pris_60_minutter ? pris.pris_60_minutter + ',-' : '' }}</td>
                    </tr>
                    <tr>
                        <td>Cupping</td>
                        <td><p class="time"><abbr title="Inklusiv">Inkl.</abbr> i massage</p>+{{ vwPrisData.Cupping.pris_inklusiv_massage ? vwPrisData.Cupping.pris_inklusiv_massage + ',-' : '' }}</td>
                        <td><p class="time"><abbr title="Eksklusiv">Ekskl.</abbr> massage</p>{{vwPrisData.Cupping.pris_ekslusiv_massage ? vwPrisData.Cupping.pris_ekslusiv_massage + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                </tbody>
            </table>
      
        <!-- MOTION PRISER -->
        <h2 class="tabel-headline">Priser for Motionscenter</h2>
            <table>
            <caption class="screenreaders-only">Priser for Motioncenter</caption>
            <thead>
                <tr>
                    <th scope="col">Enkelt billetter</th>
                    <th scope="col">Voksen</th>
                    <th scope="col">Studerende<br>(Studiekort skal forvises)</th>
                    <th scope="col" aria-hidden="true"></th>

                </tr>
            </thead>
            <tbody>
                <tr>
                    <td v-for="enkeltbillet in motionPrisData?.Enkeltbilletter || []" :key="enkeltbillet.id">{{ enkeltbillet.Titel }} <span v-if="enkeltbillet.Note">{{ enkeltbillet.Note }}</span></td>
                    <td v-for="enkeltbillet in motionPrisData?.Enkeltbilletter || []" :key="enkeltbillet.id">{{ enkeltbillet.Priser.find(p => p.Genstand === 'Voksen')?.Pris }}{{ enkeltbillet.Priser.find(p => p.Genstand === 'Voksen') ? ',-' : '' }}</td>
                    <td v-for="enkeltbillet in motionPrisData?.Enkeltbilletter || []" :key="enkeltbillet.id">{{ enkeltbillet.Priser.find(p => p.Genstand === 'Studerende')?.Pris }}{{ enkeltbillet.Priser.find(p => p.Genstand === 'Studerende') ? ',-' : '' }}</td>
                    <td scope="col" aria-hidden="true"></td>
                </tr>
            </tbody>

            <!-- --- KLIPPEKORT ---  -->
            <thead>
                <tr>
                    <th scope="col">Klippekort</th>
                    <th scope="col" aria-hidden="true"></th>
                    <th aria-hidden="true"></th>
                    <th aria-hidden="true"></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td scope="col" v-for="klip in motionPrisData?.Klippekort || []" :key="klip.id">{{ klip.Titel + ' ' + klip.Note }}</td>
                    <td v-for="klip in motionPrisData?.Klippekort || []" :key="klip.id">{{ klip.Priser.find(p => p.Genstand === 'Voksen')?.Pris }}{{ klip.Priser.find(p => p.Genstand === 'Voksen') ? ',-' : '' }}</td>
                    <td aria-hidden="true"></td>
                    <td scope="col" aria-hidden="true"></td>
                </tr>
            </tbody>

            <!-- --- MÅNEDSKORT --- -->
            <thead>
                <tr>
                    <th scope="col">Månedskort</th>
                    <th scope="col" aria-hidden="true"></th>
                    <th scope="col" aria-hidden="true"></th>
                    <th scope="col" aria-hidden="true"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="maenedskort in motionPrisData?.Maenedskort || []" :key="maenedskort.id">
                    <td>{{ maenedskort.Titel }} {{ maenedskort.Note }}</td>
                    <td>{{ maenedskort.Priser.find(p => p.Genstand === 'Voksen')?.Pris }}{{ maenedskort.Priser.find(p => p.Genstand === 'Voksen') ? ',-' : '' }}</td>
                    <td aria-hidden="true"></td>
                    <td aria-hidden="true"></td>
                </tr>
                <tr>
                    <td class="small" colspan="4">*Gælder 30 dage fra købsdato, med adgang til bad og omklædning (Kortet gælder ikke til  svømmehal).  
                    Kan anvendes 1 gang dagligt. Kun til personligt brug. <abbr title="Inklusiv">Inkl.</abbr> holdtræning</td>
                </tr>
            </tbody>
            
            <!-- --- PERSONLIG TRÆNING --- -->
            <thead>
                <tr>
                    <th scope="col">Personlig træning</th>
                    <th scope="col" aria-hidden="true"></th>
                    <th scope="col" aria-hidden="true"></th>
                    <th scope="col" aria-hidden="true"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="ptraening in motionPrisData?.Personlig_traening || []" :key="ptraening.id">
                    <td>{{ ptraening.Titel }} {{ ptraening.Note }}</td>
                    <td>{{ ptraening.Priser.find(p => p.Genstand === 'Voksen')?.Pris }}{{ ptraening.Priser.find(p => p.Genstand === 'Voksen') ? ',-' : '' }}</td>
                    <td aria-hidden="true"></td>
                    <td aria-hidden="true"></td>
                </tr>
            </tbody>

            <!-- --- PROGRAMLÆGNING --- -->
            <thead>
                <tr>
                    <th scope="col">Programlægning</th>
                    <th scope="col" aria-hidden="true"></th>
                    <th scope="col" aria-hidden="true"></th>
                    <th scope="col" aria-hidden="true"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="programlaegning in motionPrisData?.Programlaegning || []" :key="programlaegning.id">
                    <td>{{ programlaegning.Titel }} {{ programlaegning.Note }}</td>
                    <td>{{ programlaegning.Priser.find(p => p.Genstand === 'Voksen')?.Pris }}{{ programlaegning.Priser.find(p => p.Genstand === 'Voksen') ? ',-' : '' }}</td>
                    <td scope="col" aria-hidden="true"></td>
                    <td scope="col" aria-hidden="true"></td>

                </tr>
            </tbody>
        </table>
        </section>

    <Reklamekort 
    :src="getImage(vwPrisData .reklame_kort.Billede)" 
    :alt="vwPrisData .reklame_kort.Billede.alternativeText" 
    :title="vwPrisData .reklame_kort.Titel" 
    :text="vwPrisData .reklame_kort.Tekst_afsnit" 
    :Btn_title="vwPrisData .reklame_kort.Knapper[0].btn_titel" 
    :Btn_text="vwPrisData .reklame_kort.Knapper[0].btn_description" 
    :kategori="vwPrisData .reklame_kort.Kategori" 
    :Btn_icon="vwPrisData .reklame_kort.Knapper[0].Ikon[0]"></Reklamekort>
    
    </div>
</template>

<!-- INSPIRATIONSKILDE TABEL: MDN Web Docs. <table>: The Table element. 2025 (online) Mozilla Foundation 2025. [Accessed 21/05/2025] URL: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/table -->

<style scoped>

.breadwrapper{
    width: 95%;
    max-width: var(--max-width);
    margin: 0 auto;
    margin-bottom: var(--spacer-x1);
}

h1{
    width: 95%;
    max-width: var(--max-width);
    margin: 0 auto;
    margin-bottom: var(--spacer-x1);
}

.loading-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tabel-headline{
    text-align: center;
}
.screenreaders-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
  clip-path: inset(100%);
}
/* Klassen er tilføjet for at skjule elementer visuelt, men stadig gøre det tilgængeligt for skærmlæsere. Hertil anvendes "clip-path: inset(100%).
INSPIRATIONSKILDE: Milne, Monty. Web Accessibility Tip: visually hidden text for screen-readers. 24/02/2020. Medium 2025. (online) [Accessed 21/05/2025] URL: https://medium.com/web-accessibility-tips-tricks-and-techniques-for/web-accessibility-tip-visually-hidden-text-for-screen-readers-a52d954d9711
*/

table {
    width: 95%;
    max-width: var(--max-width);
    table-layout: fixed;
    margin: 0 auto;
    border-collapse: collapse;
    font-family: var(--font-text);
    margin-bottom: var(--spacer-Elements);
    color: var(--color-font-1);
}

th {
    font-family: var(--font-heading);
    width: auto;
    padding: 10px;
    text-align: left;
    font-size: 14px;
}

.type {
    font-weight: bold;
    font-size: clamp(1.1rem, 2vw, 1.2rem);
}


.th-small {
    font-size: 0.85rem;
    display: inline-block;
    font-weight: 400;
}

th, td{
    width: auto;
    padding: 10px;
    text-align: left;
    font-size: clamp(0.85rem, 1.5vw, 1.25rem);
}

td{
    font-weight: 400;
    border-bottom: 1px solid var(--color-activity-viewer-stroke);
}

.regular{
    font-weight: 400;
}

thead:not(:first-of-type) th {
  padding-top: 2rem;
}

th{
    border-bottom: 2px solid var(--color-activity-viewer-stroke);
    background-color: var(--color-body-background);
}


td:not(:first-child), th:not(:first-child) {
  text-align: center;
}

thead:not(:first-of-type) th {
  margin-top: 2rem;
}

tr:nth-child(odd){
    background-color: var(--color-pricetable)
}


.time{
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 14px;
}

.note {
    font-style: italic;
    font-size: 0.85rem;
}

abbr {
    text-decoration: none;
}


@media screen and (min-width: 700px) {
    td{
        font-size: unset;
    }
}

</style>