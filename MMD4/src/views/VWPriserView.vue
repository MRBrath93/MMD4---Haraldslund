<script setup>
import TheHero from "../components/TheHero.vue";
import TheInternNavHaraldslund from "@/components/TheInternNavHaraldslund.vue";
import TheBreadcrumb from "../components/TheBreadcrumb.vue";
import TheSpinner from "@/components/TheSpinner.vue";
import TheBtn from '@/components/TheBtn.vue';
import ImageHolder from '@/components/ImageHolder.vue';
import Reklamekort from "@/components/Reklamekort.vue";
import DynamicHeading from '@/components/DynamicHeading.vue';
import { ref, onMounted, onUnmounted } from 'vue';


const internNavLabels = [
    { id: 1, label: "Svømmehallen", name: "svommehallen-vandogwellness" },
    { id: 2, label: "Wellness", name: "wellness-vandogwellness" },
    { id: 3, label: "Holdoversigt", name: "holdoversigt-vandogwellness" },
    { id: 4, label: "Priser", name: "priser-vandogwellness" },
    { id: 5, label: "Regler", name: "regler-vandogwellness" },
];



const vandogwellnessPriserData = ref([]);
const isLoading = ref(true);
const error = ref(null);

const CACHE_DURATION_MS = 5 * 60 * 1000;

onMounted(() => {
  isLoading.value = true;
  error.value = null;

  const cachedvwPriserRaw = localStorage.getItem('vandogwellnessPriserData ');
  const cachedTimestampRaw = localStorage.getItem('cachevwpriserTimestamp');
  const now = Date.now();

  if (cachedvwPriserRaw && cachedTimestampRaw) {
    const cachedTimestamp = Number(cachedTimestampRaw);

    if (now - cachedTimestamp < CACHE_DURATION_MS) {
      try {
        vandogwellnessPriserData .value = JSON.parse(cachedvwPriserRaw);
        isLoading.value = false;
        return;
      } catch (e) {
        console.warn('Fejl ved parsing af cached data:', e);
      }
    }
  }

  fetch('https://popular-gift-b355856076.strapiapp.com/api/priser?pLevel')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Vand og Wellness - Regler fejl: ${response.status}`);
      }
      return response.json();
    })
    .then(json => {
      vandogwellnessPriserData.value = json.data;
      localStorage.setItem('vandogwellnessPriserData ', JSON.stringify(vandogwellnessPriserData .value));
      localStorage.setItem('cachevwpriserTimestamp', now.toString());
    })
    .catch(err => {
      error.value = err.message;
    })
    .finally(() => {
      isLoading.value = false;
    });
});


function getImage(billede) {
    if (!billede || !billede.formats) return '';
    return  billede.formats.medium?.url ||
        billede.formats.small?.url ||
        billede.formats.thumbnail?.url ||
        billede.url || '';
}


const isMobile = ref(window.innerWidth < 600);

function handleResize() {
  isMobile.value = window.innerWidth < 600;
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

</script>

<template>
    <div class="loading-container" v-if="isLoading">
        <TheSpinner>
            <span class="material-icons">sports_gymnastics</span>
        </TheSpinner>
    </div>
    
    <div v-else-if="error">Der opstod en fejl: {{ error }}</div>
    
    <div v-else>
        <TheHero class="heroImage"
        :title="vandogwellnessPriserData .Hero_sektion.Hero_titel_h5.Titel_H5"
        :subtitle="vandogwellnessPriserData .Hero_sektion.Hero_undertitel_h6.Undertitel_H6"
        :image="vandogwellnessPriserData .Hero_sektion.Hero_Baggrundsbillede.Billede[0].url"
        :alt="vandogwellnessPriserData .Hero_sektion.Hero_Baggrundsbillede.Billede[0].alternativeText"></TheHero>

        <TheBreadcrumb></TheBreadcrumb>
        <TheInternNavHaraldslund
            :label="internNavLabels"
        ></TheInternNavHaraldslund>
        
        <section class="textsection"  v-for="(tekstsektion,index) in vandogwellnessPriserData .Indhold.Afsnit" :key="tekstsektion.id">
                <article class="flex--column flex1">
                    <DynamicHeading :level="index === 0 ? 1 : 2">{{ tekstsektion.Overskrift }}</DynamicHeading>
                    <div v-for="single_text in tekstsektion.Tekst || []" :key="single_text.id">
                        <h3 class="subtitle" v-if="single_text.Underoverskift">{{ single_text.Underoverskift }}</h3>
                        <ul class="punkt" v-if="single_text.Skal_det_punktopstilles">
                            <li>{{ single_text.Brodtekst }}</li>
                        </ul>
                        <p v-else> {{ single_text.Brodtekst }}</p>
                    </div>
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
                <div class="img--container flex1">
                    <ImageHolder v-for="billede in tekstsektion.Billede" :key="billede.id" class="img" :src="getImage(billede)" :alt="billede.alternativeText" />
                </div>
                <!-- BILLEDEREFERENCE: 
                Haraldslund Vand og Kulturhus. Instagram 26/09/2022. Meta 2025 (online) [Accessed 07/05/2025] URL: https://www.instagram.com/p/Ci9hIi1sAgi/
                  -->
        </section>
        <section v-if="!isMobile">
            <!-- Tilføjet role="table" for at hjælpe evt. skærmlæsere eller anden teknologi med at identificere tabellen -->
             <table role="table">
                <!-- Tilføjet caption for at give skærmlæsere en beskrivelse af, hvad tabellen handler om -->
                <caption class="screenreaders-only">Priser på billetter i Vand og Wellness</caption>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr>
                        <th scope="col" class="type">Enkelt billetter</th>
                        <th scope="col">Voksen</th>
                        <th scope="col">Barn<br>(3-14 år)</th>
                        <th scope="col">Pensionist</th>
                        <th scope="col">Studerende<br>(Studiekort skal forvises)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vandogwellnessPriserData.Enkelt_Billetter" :key="pris.id">
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
                    <tr v-for="pris in vandogwellnessPriserData.Familiebilletter" :key="pris.id">
                        <td>{{ pris.Antal_born }} {{ Number(pris.Antal_born) === 1 ? 'barn' : 'børn' }}</td>
                        <td>{{ pris.Pris_1_voksen ? pris.Pris_1_voksen + ',-' : '' }}</td>
                        <td>{{ pris.Pris_2_voksne ? pris.Pris_2_voksne + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                        <td aria-hidden="true"></td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th class="regular type" scope="col">Klippekort. <span class="small">Ankomst før kl. 14:00 /<br>Ankomst efter kl. 14:00</span></th>
                        <th scope="col">Voksen</th>
                        <th scope="col">Barn<br>(3-14 år)</th>
                        <th scope="col">Pensionist</th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vandogwellnessPriserData.Klippekort" :key="pris.id">
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
                    <tr v-for="pris in vandogwellnessPriserData.Diverse_biletter" :key="pris.id">
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
                    <tr v-for="pris in vandogwellnessPriserData.personlig_svommetraening" :key="pris.id">
                        <td>{{ pris.Titel_paa_billettype }}</td>
                        <td>{{ pris.pris_25_minutter ? 'Entre + ' + pris.pris_25_minutter + ',-' : '' }}</td>
                        <td>{{ pris.pris_5x25_minutter ? 'Entre + ' + pris.pris_5x25_minutter + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                        <td aria-hidden="true"></td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr><th class="regular type" scope="col">Massage</th>
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
                    <tr v-for="pris in vandogwellnessPriserData.Massage" :key="pris.id">
                        <td>{{ pris.Titel_paa_billettype }}</td>
                        <td><p class="time">30 minutter</p>{{ pris.pris_30_minutter ? pris.pris_30_minutter + ',-' : '' }}</td>
                        <td><p class="time">45 minutter</p>{{ pris.pris_45_minutter ? pris.pris_45_minutter + ',-' : '' }}</td>
                        <td><p class="time">60 minutter</p>{{ pris.pris_60_minutter ? pris.pris_60_minutter + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                    <tr>
                        <td class="type">Cupping</td>
                        <td><p class="time">Inkl. i massage</p>+{{ vandogwellnessPriserData.Cupping.pris_inklusiv_massage ? vandogwellnessPriserData.Cupping.pris_inklusiv_massage + ',-' : '' }}</td>
                        <td><p class="time">Ekskl. massage</p>{{vandogwellnessPriserData.Cupping.pris_ekslusiv_massage ? vandogwellnessPriserData.Cupping.pris_ekslusiv_massage + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                        <td aria-hidden="true"></td>
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
                        <th scope="col" class="type">Enkelt billetter</th>
                        <th scope="col" v-for="pris in vandogwellnessPriserData.Enkelt_Billetter" :key="pris.id">{{ pris.Ankomsttidspunkt }}</th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Voksen</td>
                        <td v-for="pris in vandogwellnessPriserData.Enkelt_Billetter" :key="pris.id">{{ pris.Pris_voksen ? pris.Pris_voksen + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                    <tr>
                        <td>Barn<br>(3-14 år)</td>
                        <td v-for="pris in vandogwellnessPriserData.Enkelt_Billetter" :key="pris.id">{{ pris.Pris_barn ? pris.Pris_barn + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                    <tr>
                        <td>Pensionist</td>
                        <td v-for="pris in vandogwellnessPriserData.Enkelt_Billetter" :key="pris.id">{{ pris.Pris_pensionist ? pris.Pris_pensionist + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                    <tr>
                        <td>Studerende<br>(Studiekort skal forvises)</td>
                        <td v-for="pris in vandogwellnessPriserData.Enkelt_Billetter" :key="pris.id">{{ pris.Pris_studerende ? pris.Pris_studerende + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr>
                        <th scope="col" class="type">Familie billetter</th>
                        <th scope="col">1 Voksen</th>
                        <th scope="col">2 Voksne</th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vandogwellnessPriserData.Familiebilletter" :key="pris.id">
                        <td>{{ pris.Antal_born }} {{ Number(pris.Antal_born) === 1 ? 'barn' : 'børn' }}</td>
                        <td>{{ pris.Pris_1_voksen ? pris.Pris_1_voksen + ',-' : '' }}</td>
                        <td>{{ pris.Pris_2_voksne ? pris.Pris_2_voksne + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr>
                        <th class="regular type" scope="col">Klippekort*</th>
                        <th scope="col">Voksen</th>
                        <th scope="col">Barn<br>(3-14 år)</th>
                        <th scope="col">Pensionist</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vandogwellnessPriserData.Klippekort" :key="pris.id">
                        <td>{{ pris.Antal_klip }} Klip</td>
                        <td>{{ pris.voksen.Pris_for_1400 ? pris.voksen.Pris_for_1400 + ',-' : '' }} / {{ pris.voksen.Pris_efter_1400 ? pris.voksen.Pris_efter_1400 + ',-' : '' }}</td>
                        <td>{{ pris.Barn.Pris_for_1400 ? pris.Barn.Pris_for_1400 + ',-' : '' }} / {{ pris.Barn.Pris_efter_1400 ? pris.Barn.Pris_efter_1400 + ',-' : '' }}</td>
                        <td>{{ pris.Pensionist.Pris_for_1400 ? pris.Pensionist.Pris_for_1400 + ',-' : '' }} / {{ pris.Pensionist.Pris_efter_1400 ? pris.Pensionist.Pris_efter_1400 + ',-' : '' }}</td>
                    </tr>
                    <tr v-if="vandogwellnessPriserData.Klippekort">
                        <td colspan="4"> *Ankomst før kl. 14:00 / Ankomst efter kl. 14:00</td>
                    </tr>
                </tbody>

                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr>
                        <th scope="col" class="type">Diverse billetter</th>
                        <th scope="col" v-for="pris in vandogwellnessPriserData.Diverse_biletter" :key="pris.id">{{ pris.Titel_paa_billettype }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1 Voksen</td>
                        <td v-for="pris in vandogwellnessPriserData.Diverse_biletter" :key="pris.id">{{ pris.pris_1_person ? 'Entre + ' + pris.pris_1_person + ',-' : '' }}</td>
                    </tr>
                    <tr>
                        <td>2 Voksne</td>
                        <td v-for="pris in vandogwellnessPriserData.Diverse_biletter" :key="pris.id">{{ pris.pris_2_personer ? 'Entre + ' + pris.pris_2_personer + ',-' : '' }}</td>
                    </tr>
                    <tr>
                        <td>3 Voksne</td>
                        <td v-for="pris in vandogwellnessPriserData.Diverse_biletter" :key="pris.id">{{ pris.pris_3_personer ? 'Entre + ' + pris.pris_3_personer + ',-' : '' }}</td>
                    </tr>
                    <tr>
                        <td>4 Voksne</td>
                        <td v-for="pris in vandogwellnessPriserData.Diverse_biletter" :key="pris.id">{{ pris.pris_4_personer ? 'Entre + ' + pris.pris_4_personer + ',-' : '' }}</td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr>
                        <th scope="col" class="type">Personlig træner</th>
                        <th scope="col">25 minutter</th>
                        <th scope="col">5 x 25 minutter</th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vandogwellnessPriserData.personlig_svommetraening" :key="pris.id">
                        <td>{{ pris.Titel_paa_billettype }}</td>
                        <td>{{ pris.pris_25_minutter ? 'Entre + ' + pris.pris_25_minutter + ',-' : '' }}</td>
                        <td>{{ pris.pris_5x25_minutter ? 'Entre + ' + pris.pris_5x25_minutter + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                </tbody>
                <thead>
                    <!-- Tilføjet scope="col" på alle kolonneoverskrifter for bedre tilgængelighed -->
                    <tr>
                        <th class="regular type" scope="col">Massage</th>
                        <th scope="col" aria-hidden="true"></th>
                        <th scope="col" aria-hidden="true"></th>
                        <th scope="col" aria-hidden="true"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pris in vandogwellnessPriserData.Massage" :key="pris.id">
                        <td>{{ pris.Titel_paa_billettype }}</td>
                        <td><p class="time">30 minutter</p>{{ pris.pris_30_minutter ? pris.pris_30_minutter + ',-' : '' }}</td>
                        <td><p class="time">45 minutter</p>{{ pris.pris_45_minutter ? pris.pris_45_minutter + ',-' : '' }}</td>
                        <td><p class="time">60 minutter</p>{{ pris.pris_60_minutter ? pris.pris_60_minutter + ',-' : '' }}</td>
                    </tr>
                    <tr>
                        <td class="type">Cupping</td>
                        <td><p class="time">Inkl. i massage</p>+{{ vandogwellnessPriserData.Cupping.pris_inklusiv_massage ? vandogwellnessPriserData.Cupping.pris_inklusiv_massage + ',-' : '' }}</td>
                        <td><p class="time">Ekskl. massage</p>{{vandogwellnessPriserData.Cupping.pris_ekslusiv_massage ? vandogwellnessPriserData.Cupping.pris_ekslusiv_massage + ',-' : '' }}</td>
                        <td aria-hidden="true"></td>
                    </tr>
                </tbody>
            </table>
        </section>
        <Reklamekort 
        :src="getImage(vandogwellnessPriserData .reklame_kort.Billede)" 
        :alt="vandogwellnessPriserData .reklame_kort.Billede.alternativeText" 
        :title="vandogwellnessPriserData .reklame_kort.Titel" 
        :text="vandogwellnessPriserData .reklame_kort.Tekst_afsnit" 
        :Btn_title="vandogwellnessPriserData .reklame_kort.Knapper[0].btn_titel" 
        :Btn_text="vandogwellnessPriserData .reklame_kort.Knapper[0].btn_description" 
        :kategori="vandogwellnessPriserData .reklame_kort.Kategori" 
        :Btn_icon="vandogwellnessPriserData .reklame_kort.Knapper[0].Ikon[0]"></Reklamekort>
    </div>
</template>

<style scoped>

.loading-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* TEKST SECTION STYLE */

.textsection {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-x2);
  margin: 0 auto;
  margin-bottom: var(--spacer-Elements);
  width: 95%;
  max-width: var(--max-width);
}

.type {
    font-weight: bold;
    font-size: clamp(1.1rem, 2vw, 1.2rem);
}

.small {
    font-size: 0.8rem;
    font-family: var(--font-text);
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
  white-space: nowrap;
  border: 0;
  clip-path: inset(100%);
}

table {
    width: 100%;
    max-width: var(--max-width);
    table-layout: fixed;
    margin: 0 auto;
    border-collapse: collapse;
    font-family: var(--font-text);
    color: var(--color-font-1);
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
  padding-top: 2rem; 
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