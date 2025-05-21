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
const CACHE_DURATION_MS = 5 * 60 * 1000;

// FETCH DATA
onMounted(() => {
    window.addEventListener('resize', handleResize);

    isLoading.value = true;
    error.value = null;

    const cachedvwPriserRaw = localStorage.getItem('vwPrisData');
    const cachedMotionPriserRaw = localStorage.getItem('motionPrisData');
    const cachedTimestampRaw = localStorage.getItem('cacheTimestamp');
    const now = Date.now();

    if (cachedvwPriserRaw && cachedMotionPriserRaw && cachedTimestampRaw) {
        const cachedTimestamp = Number(cachedTimestampRaw);

        if (now - cachedTimestamp < CACHE_DURATION_MS) {
        try {
            vwPrisData.value = JSON.parse(cachedvwPriserRaw);
            motionPrisData.value = JSON.parse(cachedMotionPriserRaw);
            isLoading.value = false;
            return;
        } catch (e) {
            console.warn('Fejl ved parsing af cached data:', e);
        }
        }
    }

    Promise.all([
        fetch('https://popular-gift-b355856076.strapiapp.com/api/priser-motion?pLevel'),
        fetch('https://popular-gift-b355856076.strapiapp.com/api/priser?pLevel')
    ])
        .then(async ([resMotion, resVW]) => {
        if (!resMotion.ok || !resVW.ok) {
            throw new Error(`Fejl ved fetch: ${resMotion.status} / ${resVW.status}`);
        }
        const [motionJson, vwJson] = await Promise.all([resMotion.json(), resVW.json()]);
        motionPrisData.value = motionJson.data;
        vwPrisData.value = vwJson.data;

        localStorage.setItem('motionPrisData', JSON.stringify(motionPrisData.value));
        localStorage.setItem('vwPrisData', JSON.stringify(vwPrisData.value));
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
  window.removeEventListener('resize', handleResize);
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
    <main v-if="isLoading">
        <TheSpinner>
            <span class="material-icons">sports_gymnastics</span>
        </TheSpinner>
    </main>
    <main v-else-if="error">Der opstod en fejl: {{ error }}</main>
    <main v-else>
        <TheHero
            title="HARALDSLUND"
            subtitle="Prisoversigt"
            description="Find priser for billetter og abonnementer til Haraldslund."
            image="@/assets/images/haraldslund.jpg"
            alt="Haraldslund Vand og kulturhus"/>
        <h1>Prisoversigt</h1>
        <TheBreadcrumb />
        <TheInternNavHaraldslund
        :label="internNavLabels"
        />

         <section v-if="!isMobile">
            <!-- VAND OG WELLNESS PRISER -->
            <!-- Tilføjet role="table" for at hjælpe evt. skærmlæsere eller anden teknologi med at identificere tabellen -->
             <table role="table">
                <!-- Tilføjet caption for at give skærmlæsere en beskrivelse af, hvad tabellen handler om -->
                <caption class="screenreaders-only">Priser på billetter i Vand og Wellness</caption>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th scope="col"><h5>Enkelt billetter</h5></th>
                        <th scope="col">Voksen</th>
                        <th scope="col">Barn<br>(3-14 år)</th>
                        <th scope="col">Pensionist</th>
                        <th scope="col">Studerende<br>(Studiekort skal forvises)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vwPrisData.Enkelt_Billetter" :key="pris.id">
                        <td>{{ pris.Ankomsttidspunkt }}</td>
                        <td>{{ pris.Pris_voksen ? pris.Pris_voksen + ',-' : '' }}</td>
                        <td>{{ pris.Pris_barn ? pris.Pris_barn + ',-' : '' }}</td>
                        <td>{{ pris.Pris_pensionist ? pris.Pris_pensionist + ',-' : '' }}</td>
                        <td>{{ pris.Pris_studerende ? pris.Pris_studerende + ',-' : '' }}</td>
                    </tr>
                    <!-- Tilføjet fallback-række hvis der ingen data er, med korrekt colspan="5" -->
                    <tr v-if="vwPrisData.Enkelt_Billetter.length === 0">
                        <td colspan="5" style="text-align: center; padding: 1rem;">Der er ingen hold resten af dagen.</td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th scope="col"><h5>Familie billetter</h5></th>
                        <th scope="col">1 Voksen</th>
                        <th scope="col">2 Voksne</th>
                        <th scope="col" aria-hidden="true"></th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vwPrisData.Familiebilletter" :key="pris.id">
                        <td>{{ pris.Antal_born }} {{ Number(pris.Antal_born) === 1 ? 'barn' : 'børn' }}</td>
                        <td>{{ pris.Pris_1_voksen ? pris.Pris_1_voksen + ',-' : '' }}</td>
                        <td>{{ pris.Pris_2_voksne ? pris.Pris_2_voksne + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                        <td aria-hidden="true"></td>
                    </tr>
                    <!-- Tilføjet fallback-række hvis der ingen data er, med korrekt colspan="5" -->
                    <tr v-if="vwPrisData.Familiebilletter.length === 0">
                        <td colspan="5" style="text-align: center; padding: 1rem;">Der er ingen hold resten af dagen.</td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th class="regular" scope="col"><h5>Klippekort</h5>Ankomst før kl. 14:00 /<br>Ankomst efter kl. 14:00</th>
                        <th scope="col">Voksen</th>
                        <th scope="col">Barn<br>(3-14 år)</th>
                        <th scope="col">Pensionist</th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vwPrisData.Klippekort" :key="pris.id">
                        <td>{{ pris.Antal_klip }} Klip</td>
                        <td>{{ pris.voksen.Pris_for_1400 ? pris.voksen.Pris_for_1400 + ',-' : '' }} / {{ pris.voksen.Pris_efter_1400 ? pris.voksen.Pris_efter_1400 + ',-' : '' }}</td>
                        <td>{{ pris.Barn.Pris_for_1400 ? pris.Barn.Pris_for_1400 + ',-' : '' }} / {{ pris.Barn.Pris_efter_1400 ? pris.Barn.Pris_efter_1400 + ',-' : '' }}</td>
                        <td>{{ pris.Pensionist.Pris_for_1400 ? pris.Pensionist.Pris_for_1400 + ',-' : '' }} / {{ pris.Pensionist.Pris_efter_1400 ? pris.Pensionist.Pris_efter_1400 + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                    <!-- Tilføjet fallback-række hvis der ingen data er, med korrekt colspan="5" -->
                    <tr v-if="vwPrisData.Klippekort.length === 0">
                        <td colspan="5" style="text-align: center; padding: 1rem;">Der er ingen hold resten af dagen.</td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th scope="col"><h5>Diverse billetter</h5></th>
                        <th scope="col">1 Person</th>
                        <th scope="col">2 Personer</th>
                        <th scope="col">3 Personer</th>
                        <th scope="col">4 Personer</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vwPrisData.Diverse_biletter" :key="pris.id">
                        <td>{{ pris.Titel_paa_billettype }}</td>
                        <td>{{ pris.pris_1_person ? 'Entre + ' + pris.pris_1_person + ',-' : '' }}</td>
                        <td>{{ pris.pris_2_personer ? 'Entre + ' + pris.pris_2_personer + ',-' : '' }}</td>
                        <td>{{ pris.pris_3_personer ? 'Entre + ' + pris.pris_3_personer + ',-' : '' }}</td>
                        <td>{{ pris.pris_4_personer ? 'Entre + ' + pris.pris_4_personer + ',-' : '' }}</td>
                    </tr>
                    <!-- Tilføjet fallback-række hvis der ingen data er, med korrekt colspan="5" -->
                    <tr v-if="vwPrisData.Diverse_biletter.length === 0">
                        <td colspan="5" style="text-align: center; padding: 1rem;">Der er ingen hold resten af dagen.</td>
                    </tr>
                </tbody>

                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th scope="col"><h5>Personlig træner</h5></th>
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
                    <!-- Tilføjet fallback-række hvis der ingen data er, med korrekt colspan="5" -->
                    <tr v-if="vwPrisData.Familiebilletter.length === 0">
                        <td colspan="5" style="text-align: center; padding: 1rem;">Der er ingen hold resten af dagen.</td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th class="regular" scope="col"><h5>Massage</h5></th>
                        <!-- <th scope="col">30 minutter</th>
                        <th scope="col">45 minutter</th>
                        <th scope="col">60 minutter</th> -->
                        <th scope="col" aria-hidden="true"></th>
                        <th scope="col" aria-hidden="true"></th>
                        <th scope="col" aria-hidden="true"></th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vwPrisData.Massage" :key="pris.id">
                        <td>{{ pris.Titel_paa_billettype }}</td>
                        <td><p class="time">30 minutter</p>{{ pris.pris_30_minutter ? pris.pris_30_minutter + ',-' : '' }}</td>
                        <td><p class="time">45 minutter</p>{{ pris.pris_45_minutter ? pris.pris_45_minutter + ',-' : '' }}</td>
                        <td><p class="time">60 minutter</p>{{ pris.pris_60_minutter ? pris.pris_60_minutter + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                    <tr>
                        <td>Cupping</td>
                        <td><p class="time">Inkl. i massage</p>+{{ vwPrisData.Cupping.pris_inklusiv_massage ? vwPrisData.Cupping.pris_inklusiv_massage + ',-' : '' }}</td>
                        <td><p class="time">Ekskl. massage</p>{{vwPrisData.Cupping.pris_ekslusiv_massage ? vwPrisData.Cupping.pris_ekslusiv_massage + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                        <td aria-hidden="true"></td>
                    </tr>

                    <!-- Tilføjet fallback-række hvis der ingen data er, med korrekt colspan="5" -->
                    <tr v-if="vwPrisData.Klippekort.length === 0">
                        <td colspan="5" style="text-align: center; padding: 1rem;">Der er ingen hold resten af dagen.</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <!-- MOTION PRISER -->
        <section v-if="!isMobile">
            <table>
            <caption class="screenreaders-only">Priser for Motioncenter</caption>
            <thead>
                <tr>
                    <th scope="col">Enkelt billetter</th>
                    <th scope="col">Voksen</th>
                    <th scope="col">Studerende<br><small>(Studiekort skal forvises)</small></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="enkeltbillet in motionPrisData.Enkeltbilletter" :key="enkeltbillet.id">
                <td>{{ enkeltbillet.Titel }} <span v-if="enkeltbillet.Note">({{ enkeltbillet.Note }})</span></td>
                <td>
                    {{ enkeltbillet.Priser.find(p => p.Genstand === 'Voksen')?.Pris }}{{ enkeltbillet.Priser.find(p => p.Genstand === 'Voksen') ? ',-' : '' }}
                </td>
                <td>
                    {{ enkeltbillet.Priser.find(p => p.Genstand === 'Studerende')?.Pris }}{{ enkeltbillet.Priser.find(p => p.Genstand === 'Studerende') ? ',-' : '' }}
                </td>
                </tr>
            </tbody>


            <!-- --- KLIPPEKORT ---  -->
            <thead>
                <tr>
                    <th class="regular" scope="col"><h5>Klippekort</h5></th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <template v-for="klip in motionPrisData.Klippekort" :key="klip.id">
                    <tr>
                        <td>{{ klip.Titel + ' ' + klip.Note }}</td>
                        <td>{{ klip.Priser.find(p => p.Genstand === 'Voksen')?.Pris }}{{ klip.Priser.find(p => p.Genstand === 'Voksen') ? ',-' : '' }}</td>
                        <td>{{ klip.Priser.find(p => p.Genstand === 'Studerende')?.Pris }}{{ klip.Priser.find(p => p.Genstand === 'Studerende') ? ',-' : '' }}</td>
                    </tr>
                </template>
            </tbody>

            <!-- --- MÅNEDSKORT --- -->
            <thead>
                <tr>
                    <th class="regular" scope="col"><h5>Månedskort</h5></th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="maenedskort in motionPrisData.Maenedskort" :key="maenedskort.id">
                    <td>{{ maenedskort.Titel }} {{ maenedskort.Note }}</td>
                    <td>{{ maenedskort.Priser.find(p => p.Genstand === 'Voksen')?.Pris }}{{ maenedskort.Priser.find(p => p.Genstand === 'Voksen') ? ',-' : '' }}</td>
                    <td>{{ maenedskort.Priser.find(p => p.Genstand === 'Studerende')?.Pris }}{{ maenedskort.Priser.find(p => p.Genstand === 'Studerende') ? ',-' : '' }}</td>
                </tr>
            </tbody>
            <p class="small">Gælder 30 dage fra købsdato, med adgang til bad og omklædning (Kortet gælder ikke til  svømmehal).  Kan anvendes 1 gang dagligt. Kun til personligt brug. inkl. holdtræning</p>
            
            <!-- --- PERSONLIG TRÆNING --- -->
            <thead>
                <tr>
                    <th class="regular" scope="col"><h5>Personlig træning</h5></th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="ptraening in motionPrisData.Personlig_traening" :key="ptraening.id">
                    <td>{{ ptraening.Titel }} {{ ptraening.Note }}</td>
                    <td>{{ ptraening.Priser.find(p => p.Genstand === 'Voksen')?.Pris }}{{ ptraening.Priser.find(p => p.Genstand === 'Voksen') ? ',-' : '' }}</td>
                    <td>{{ ptraening.Priser.find(p => p.Genstand === 'Studerende')?.Pris }}{{ ptraening.Priser.find(p => p.Genstand === 'Studerende') ? ',-' : '' }}</td>
                </tr>
            </tbody>

            <!-- --- PROGRAMLÆGNING --- -->
            <thead>
                <tr>
                    <th class="regular" scope="col"><h5>Programlægning</h5></th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="programlaegning in motionPrisData.Programlaegning" :key="programlaegning.id">
                    <td>{{ programlaegning.Titel }} {{ programlaegning.Note }}</td>
                    <td>{{ programlaegning.Priser.find(p => p.Genstand === 'Voksen')?.Pris }}{{ programlaegning.Priser.find(p => p.Genstand === 'Voksen') ? ',-' : '' }}</td>
                    <td>{{ programlaegning.Priser.find(p => p.Genstand === 'Studerende')?.Pris }}{{ programlaegning.Priser.find(p => p.Genstand === 'Studerende') ? ',-' : '' }}</td>
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
    
    </main>
</template>

<style scoped>

/* TEKST SECTION STYLE */

.textsection {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-x2);
  margin: 0 auto;
  margin-bottom: var(--spacer-Elements);
  width: 100%;
  max-width: var(--max-width);
}

.img--container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.img{
    height: 100%;
}

.subtitle{
    margin-top: var(--spacer-x1);
}

.punkt{
    margin-inline-start: var(--spacer-x1);
    font-family: var(--font-text);
    
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
    height: fit-content;
}

.flex1{
    flex: 1;
}

section{
    width: 95%;
    margin: 0 auto;
}

@media screen and (min-width: 500px) {
    .btn--container{
        flex-direction: row;
    }
}

@media screen and (min-width: 900px) {
    .textsection{
        flex-direction: row;
    }
    .btn--container{
        flex-direction: column;
    }

}
@media screen and (min-width: 1000px) {

    .btn--container{
        flex-direction: row;
    }
}
/* TEKSTSTYLE SLUT */


.text-align-center{
    text-align: center;
}

.screenreaders-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

table {
    width: 95%;
    max-width: var(--max-width);
    table-layout: fixed;
    margin: 0 auto;
    border-collapse: collapse;
    font-family: var(--font-text);
}

th h5{
    font-size: 14px;
}

th, td{
    width: auto;
    padding: 10px;
    text-align: left;
    font-size: 14px;
}

td{
    font-weight: 400;
}

.regular{
    font-weight: 400;
}

thead:not(:first-of-type) th {
  padding-top: 2rem; /* eller hvad du ønsker */
}

th{
    border-bottom: 1px solid var(--color-activity-viewer-stroke);
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

section{
    margin-bottom: var(--spacer-Elements);
}

.time{
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 14px;
}


@media screen and (min-width: 700px) {
    td{
        font-size: unset;
    }
}

</style>