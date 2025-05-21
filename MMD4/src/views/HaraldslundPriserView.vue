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
        <section v-if="isMobile">
            <table role="table">
                <!-- Tilføjet caption for at give skærmlæsere en beskrivelse af, hvad tabellen handler om -->
                <caption class="screenreaders-only">Priser på billetter i Vand og Wellness</caption>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr>
                        <th scope="col"><h5>Enkelt billetter</h5></th>
                        <th scope="col" v-for="pris in vwPrisData.Enkelt_Billetter" :key="pris.id">{{ pris.Ankomsttidspunkt }}</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Voksen</td>
                        <td v-for="pris in vwPrisData.Enkelt_Billetter" :key="pris.id">{{ pris.Pris_voksen ? pris.Pris_voksen + ',-' : '' }}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Barn<br>(3-14 år)</td>
                        <td v-for="pris in vwPrisData.Enkelt_Billetter" :key="pris.id">{{ pris.Pris_barn ? pris.Pris_barn + ',-' : '' }}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Pensionist</td>
                        <td v-for="pris in vwPrisData.Enkelt_Billetter" :key="pris.id">{{ pris.Pris_barn ? pris.Pris_barn + ',-' : '' }}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Studerende<br>(Studiekort skal forvises)</td>
                        <td v-for="pris in vwPrisData.Enkelt_Billetter" :key="pris.id">{{ pris.Pris_barn ? pris.Pris_barn + ',-' : '' }}</td>
                        <td></td>
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
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vwPrisData.Familiebilletter" :key="pris.id">
                        <td>{{ pris.Antal_born }} {{ Number(pris.Antal_born) === 1 ? 'barn' : 'børn' }}</td>
                        <td>{{ pris.Pris_1_voksen ? pris.Pris_1_voksen + ',-' : '' }}</td>
                        <td>{{ pris.Pris_2_voksne ? pris.Pris_2_voksne + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                    <!-- Tilføjet fallback-række hvis der ingen data er, med korrekt colspan="5" -->
                    <tr v-if="vwPrisData.Familiebilletter.length === 0">
                        <td colspan="5" style="text-align: center; padding: 1rem;">Der er ingen hold resten af dagen.</td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th class="regular" scope="col"><h5>Klippekort*</h5></th>
                        <th scope="col">Voksen</th>
                        <th scope="col">Barn<br>(3-14 år)</th>
                        <th scope="col">Pensionist</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vwPrisData.Klippekort" :key="pris.id">
                        <td>{{ pris.Antal_klip }} Klip</td>
                        <td>{{ pris.voksen.Pris_for_1400 ? pris.voksen.Pris_for_1400 + ',-' : '' }} / {{ pris.voksen.Pris_efter_1400 ? pris.voksen.Pris_efter_1400 + ',-' : '' }}</td>
                        <td>{{ pris.Barn.Pris_for_1400 ? pris.Barn.Pris_for_1400 + ',-' : '' }} / {{ pris.Barn.Pris_efter_1400 ? pris.Barn.Pris_efter_1400 + ',-' : '' }}</td>
                        <td>{{ pris.Pensionist.Pris_for_1400 ? pris.Pensionist.Pris_for_1400 + ',-' : '' }} / {{ pris.Pensionist.Pris_efter_1400 ? pris.Pensionist.Pris_efter_1400 + ',-' : '' }}</td>
                    </tr>
                    <tr v-if="vwPrisData.Klippekort">
                        <td colspan="4"> *Ankomst før kl. 14:00 / Ankomst efter kl. 14:00</td>
                    </tr>
                    <!-- Tilføjet fallback-række hvis der ingen data er, med korrekt colspan="5" -->
                    <tr v-if="vwPrisData.Klippekort.length === 0">
                        <td colspan="5" style="text-align: center; padding: 1rem;">Der er ingen hold resten af dagen.</td>
                    </tr>
                </tbody>

                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr>
                        <th scope="col"><h5>Diverse billetter</h5></th>
                        <th scope="col" v-for="pris in vwPrisData.Diverse_biletter" :key="pris.id">{{ pris.Titel_paa_billettype }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1 Voksen</td>
                        <td v-for="pris in vwPrisData.Diverse_biletter" :key="pris.id">{{ pris.pris_1_person ? 'Entre + ' + pris.pris_1_person + ',-' : '' }}</td>
                    </tr>
                    <tr>
                        <td>2 Voksne</td>
                        <td v-for="pris in vwPrisData.Diverse_biletter" :key="pris.id">{{ pris.pris_2_personer ? 'Entre + ' + pris.pris_2_personer + ',-' : '' }}</td>
                    </tr>
                    <tr>
                        <td>3 Voksne</td>
                        <td v-for="pris in vwPrisData.Diverse_biletter" :key="pris.id">{{ pris.pris_3_personer ? 'Entre + ' + pris.pris_3_personer + ',-' : '' }}</td>
                    </tr>
                    <tr>
                        <td>4 Voksne</td>
                        <td v-for="pris in vwPrisData.Diverse_biletter" :key="pris.id">{{ pris.pris_4_personer ? 'Entre + ' + pris.pris_4_personer + ',-' : '' }}</td>
                    </tr>
                    <!-- Tilføjet fallback-række hvis der ingen data er, med korrekt colspan="5" -->
                    <tr v-if="vwPrisData.Enkelt_Billetter.length === 0">
                        <td colspan="5" style="text-align: center; padding: 1rem;">Der er ingen hold resten af dagen.</td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th scope="col"><h5>Personlig træner</h5></th>
                        <th scope="col">25 minutter</th>
                        <th scope="col">5 x 25 minutter</th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vwPrisData.personlig_svommetraening" :key="pris.id">
                        <td>{{ pris.Titel_paa_billettype }}</td>
                        <td>{{ pris.pris_25_minutter ? 'Entre + ' + pris.pris_25_minutter + ',-' : '' }}</td>
                        <td>{{ pris.pris_5x25_minutter ? 'Entre + ' + pris.pris_5x25_minutter + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                    <!-- Tilføjet fallback-række hvis der ingen data er, med korrekt colspan="5" -->
                    <tr v-if="vwPrisData.Familiebilletter.length === 0">
                        <td colspan="5" style="text-align: center; padding: 1rem;">Der er ingen hold resten af dagen.</td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr>
                        <th class="regular" scope="col"><h5>Massage</h5></th>
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
                    </tr>
                    <tr>
                        <td>Cupping</td>
                        <td><p class="time">Inkl. i massage</p>+{{ vwPrisData.Cupping.pris_inklusiv_massage ? vwPrisData.Cupping.pris_inklusiv_massage + ',-' : '' }}</td>
                        <td><p class="time">Ekskl. massage</p>{{vwPrisData.Cupping.pris_ekslusiv_massage ? vwPrisData.Cupping.pris_ekslusiv_massage + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>

                    <!-- Tilføjet fallback-række hvis der ingen data er, med korrekt colspan="5" -->
                    <tr v-if="vwPrisData.Klippekort.length === 0">
                        <td colspan="5" style="text-align: center; padding: 1rem;">Der er ingen hold resten af dagen.</td>
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
main{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>