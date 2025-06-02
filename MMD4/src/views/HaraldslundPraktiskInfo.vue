<script setup>
// IMPORTS
import { ref, onMounted } from "vue";
import TheBtn from "@/components/TheBtn.vue";
import TheInternNavHaraldslund from "../components/TheInternNavHaraldslund.vue";
import TheBreadcrumb from "../components/TheBreadcrumb.vue";
import TheHero from "../components/TheHero.vue";
import TheSpinner from "../components/TheSpinner.vue";
import DynamicHeading from "@/components/DynamicHeading.vue";
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

// INSPIRATIONSKILDER LOCALSTORAGE + CACHE DATA
// Steve Griffith - Prof3ssorSt3v3. How to Cache Data with LocalStorage. (online). Youtube 2025. [Accessed 20/05/2025] URL: https://www.youtube.com/watch?v=fe6rCk7a6u0
// Emma Delaney. Mastering JavaScript Caching: A Step-by-Step Guide to Efficiently Build and Optimize Your Cache. (online). Medium 2025. [Accessed 20/05/2025] URL: https://emma-delaney.medium.com/mastering-javascript-caching-a-step-by-step-guide-to-efficiently-build-and-optimize-your-cache-dee8fd96a34e

// REAKTIVE VARIABLER
const praktiskData = ref(null);
const isLoading = ref(true);
const error = ref(null);

// CACHE VARIABLER
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
        :title="praktiskData.Hero_sektion.Hero_titel_h5?.Titel_H5"
        :subtitle="praktiskData.Hero_sektion.Hero_undertitel_h6?.Undertitel_H6"
        description="Læs praktisk information om Haraldslund Vand og Kulturhus"
        :image="praktiskData.Hero_sektion?.Hero_Baggrundsbillede?.Billede[0].url"
        :alt="praktiskData.Hero_sektion.Hero_Baggrundsbillede?.data?.attributes?.alternativeText || 'Hero billede'" ></TheHero>

        <section class="content-container">
          <TheBreadcrumb></TheBreadcrumb>
          <TheInternNavHaraldslund
          :label="internNavLabels"
          ></TheInternNavHaraldslund>
  
          <h1 tabindex="-1"> {{ praktiskData.Titel }} </h1>
        </section>
        <section class="section-container">
            <div v-for="(kontaktoplysning,index) in praktiskData?.Kontaktoplysninger || []" 
            :key="kontaktoplysning.id">
              <DynamicHeading :level="index === 0 ? 2 : 2">{{ kontaktoplysning.Overskrift }}</DynamicHeading>
                <div v-for="tekst in kontaktoplysning.Tekst || []" :key="tekst.id">
                    <p v-if="tekst.Underoverskift" class="fat-text">{{ tekst.Underoverskift }}</p>
                    <p>{{ tekst.Brodtekst }}</p>
                </div>
                <div v-if="kontaktoplysning.Knapper?.length > 0">
                  <TheBtn
                  v-for="btn in kontaktoplysning.Knapper || []"
                  :key="btn.id"
                  :link="btn.link_to"
                  :title="btn.btn_titel"
                  :text="btn.btn_description"
                  :icon="btn.Ikon[0]"
                  target="_blank">
                  </TheBtn>
                </div>
            </div>
            <div class="wrapper-content">
              <h2>Åbningstider</h2>
              <div v-for="aabningstider in praktiskData?.Almene_aabningstider || []" :key="aabningstider.id">
                  <div class="time-container">
                      <p v-if="aabningstider.Dag">{{ aabningstider.Dag }} :</p>
                      <span v-if="aabningstider.Har_Vi_Lukket  === true "> Lukket </span>
                      <div v-else-if="aabningstider.Har_Vi_Lukket  === false ">
                          <span v-if="aabningstider.Start_tidspunkt "> {{  aabningstider.Start_tidspunkt.split(':')[0] }}:{{ aabningstider.Start_tidspunkt.split(':')[1] }} - </span>
                          <span v-if="aabningstider.Slut_tidspunkt "> {{  aabningstider.Slut_tidspunkt.split(':')[0] }}:{{ aabningstider.Slut_tidspunkt.split(':')[1] }}</span>
                      </div>
                      <!-- Split() anvendes for at sortere i strengens længde, da der ikke er behov for visning af sekunder i grænsefladen.
                      INSPIRATIONSKILDE SPLIT: W3Schools.JavaScript String split(). 2025. [Accessed 20/05/25] (online) URL: https://www.w3schools.com/jsref/jsref_split.asp -->
                  </div>
              </div>
              <div v-if="praktiskData?.Specielle_aabningstider && praktiskData.Specielle_aabningstider.length > 0">
                <div v-for="specielTid in praktiskData?.Specielle_aabningstider || []" :key="specielTid.id" id="specielTid">            
                  <section>
                    <div>
                        <p v-if="specielTid.Dag">{{ specielTid.Dag }}</p>
                        <span v-if="specielTid.Har_Vi_Lukket  === true "> Lukket </span>
                        <div v-else-if="specielTid.Har_Vi_Lukket  === false ">
                            <span v-if="specielTid.Start_tidspunkt "> {{  specielTid.Start_tidspunkt.split(':')[0] }}:{{ specielTid.Start_tidspunkt.split(':')[1] }} - </span>
                            <span v-if="specielTid.Slut_tidspunkt "> {{  specielTid.Slut_tidspunkt.split(':')[0] }}:{{ specielTid.Slut_tidspunkt.split(':')[1] }}</span>
                        </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
        </section>
        <section v-for="findVej in praktiskData?.Find_vej || []" 
        :key="findVej.id"
        class="section-container"
        >
          <div class="flex-column">
            <h2>{{ findVej.Overskrift }}</h2>
            <div v-for="tekst in findVej.Tekst || []" 
            :key="tekst.id"
            >
                <p v-if="tekst.Underoverskift" class="fat-text">{{ tekst.Underoverskift }}</p>
                <div v-if="tekst.Skal_det_punktopstilles">
                  <ul>
                    <li v-for="punkt in tekst.Brodtekst" :key="punkt.id"> {{ punkt }}</li>
                  </ul>
                </div>
                <p v-else> {{ tekst.Brodtekst }}</p>
            </div>
            <div v-if="findVej.Knapper?.length > 0">
              <TheBtn
              v-for="btn in findVej.Knapper || []"
              :key="btn.id"
              :link="btn.link_to"
              :title="btn.btn_titel"
              :text="btn.btn_description"
              :icon="btn.Ikon[0]">
              </TheBtn>
            </div>
          </div>
          <figure v-if="findVej.Billede?.length > 0">
              <ImageHolder
              v-for="billede in findVej.Billede"
              :key="billede?.id"
              class="side-img"
              :src="getImage(billede)"
              :alt="billede?.data?.attributes?.alternativeText || 'Billede' " />
          </figure>
        </section>
        <!-- BILLEDE REFERENCER:
        Find vej dronebillede: Facebook: Haraldslund Vand og Kulturhus. 15/06/2023. (online) Facebook.com. Meta 2025. [Accessed 07/05/2025] URL: https://www.facebook.com/photo.php?fbid=851476806451500&set=pb.100047675655563.-2207520000&type=3 -->
        <section v-for="afsnit in praktiskData?.Udstilling || []" 
        :key="afsnit.id"
        class="section-container"
        >
          <div>
            <div class="flex-column">
              <h2>{{ afsnit.Overskrift }}</h2>
              <div v-for="tekst in afsnit.Tekst || []" :key="tekst.id">
                <h3 v-if="tekst.Underoverskift">{{ tekst.Underoverskift }}</h3>
                <span>
                  <div v-if="tekst.Skal_det_punktopstilles">
                    <ul>
                      <li v-for="punkt in tekst.Brodtekst" :key="punkt.id"> {{ punkt }}</li>
                    </ul>
                  </div>
                  <p v-else> {{ tekst.Brodtekst }}</p>
                </span>  
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
          </div>
          <figure v-if="afsnit.Billede?.length > 0">
              <ImageHolder
              v-for="billede in afsnit.Billede"
              :key="billede?.id"
              class="side-img"
              :src="getImage(billede)"
              :alt="billede?.data?.attributes?.alternativeText || 'Billede' " />
          </figure>
        </section>
         <!-- BILLEDE REFERENCER:
              Udstilling2: Facebook: Haraldslund Vand og Kulturhus. 05/11/2023. (online) Facebook.com. Meta 2025. [Accessed 07/05/2025] URL: https://www.facebook.com/photo.php?fbid=969880011277845&set=pb.100047675655563.-2207520000&type=3
              Udstilling1: Facebook: Haraldslund Vand og Kulturhus. 05/11/2023. (online) Facebook.com. Meta 2025. [Accessed 07/05/2025] URL: https://www.facebook.com/photo.php?fbid=969880017944511&set=pb.100047675655563.-2207520000&type=3 -->
          <section class="section-container" v-for="facilitet in praktiskData?.Faciliteter || []" 
            :key="facilitet.id"
            >
              <div class="flex-column">
                <h2>{{ facilitet.Overskrift }}</h2>
                <div v-for="tekst in facilitet.Tekst || []" :key="tekst.id">
                  <span>
                  <h3 v-if="tekst.Underoverskift">{{ tekst.Underoverskift }}</h3>
                    <div v-if="tekst.Skal_det_punktopstilles">
                      <ul>
                        <li v-for="punkt in tekst.Brodtekst" :key="punkt.id"> {{ punkt }}</li>
                      </ul>
                    </div>
                    <p v-else> {{ tekst.Brodtekst }}</p>
                  </span>  
                </div>
                <div v-if="facilitet.Knapper?.length > 0">
                  <TheBtn
                  v-for="btn in facilitet.Knapper || []"
                  :key="btn.id"
                  link="https://was.digst.dk/haraldslund-com"
                  :title="btn.btn_titel"
                  :text="btn.btn_description"
                  :icon="btn.Ikon[0]">
                  </TheBtn>
                </div>
              </div>
              <figure v-if="facilitet.Billede?.length > 0">
                  <ImageHolder
                  v-for="billede in facilitet.Billede"
                  :key="billede?.id"
                  class="small-side-img"
                  :src="getImage(billede)"
                  :alt="billede?.data?.attributes?.alternativeText || 'Billede' " />
              </figure>
          </section>
          <!-- BILLEDE REFERENCER:
          Petrenko, Dasha. Fil#: 705048470. (online). Adobe Stock 2025. [Accessed 07/05/2025] URL: https://stock.adobe.com/dk/images/beautiful-smiling-young-woman-taking-a-shower-in-gym/705048470
          Daxenbichler, Patrick. Fil#: 204805082. (online). Adobe Stock 2025. [Accessed 07/05/2025] URL: https://stock.adobe.com/dk/images/blaue-spinde-und-vorhangeschloss-in-der-schule-umkleide/204805082
           Albers, Joachim B. Fil#: 31387757. (online). Adobe Stock 2025. [Accessed 07/05/2025] URL: https://stock.adobe.com/dk/images/kleidungsstucke-hangen-im-umkleideraum/31387757
            -->
          <section class="section-container">
            <div v-for="personData in praktiskData?.Persondata || []" :key="personData.id">
              <div class="persondata-container"> 
                <h2>{{ personData.Overskrift }}</h2>
                  <div v-for="tekst in personData.Tekst || []" :key="tekst.id">
                    <span>
                    <p v-if="tekst.Underoverskift" class="fat-text">{{ tekst.Underoverskift }}</p>
                      <div v-if="tekst.Skal_det_punktopstilles">
                        <ul>
                          <li v-for="punkt in tekst.Brodtekst" :key="punkt.id"> {{ punkt }}</li>
                        </ul>
                      </div>
                      <p v-else> {{ tekst.Brodtekst }}</p>
                    </span>  
                  </div>
                  <div v-if="personData.Knapper?.length > 0">
                    <TheBtn
                    v-for="btn in personData.Knapper || []"
                    :key="btn.id"
                    link="https://www.datatilsynet.dk/"
                    :title="btn.btn_titel"
                    :text="btn.btn_description"
                    :icon="btn.Ikon[0]">
                    </TheBtn>
                  </div>
                  <figure v-if="personData.Billede?.length > 0">
                      <ImageHolder
                      v-for="billede in personData.Billede"
                      :key="billede?.id"
                      class="side-img"
                      :src="getImage(billede)"
                      :alt="billede?.data?.attributes?.alternativeText || 'Billede' " />
                  </figure>
              </div>
            </div>
          </section>
    </div>
</template>

<style scoped>
.loading-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-container{
  width: 100%;
  margin: 0 auto;
}

.content-container h1{
  margin-bottom: var(--spacer-x2);
}

.heading{
    max-width: var(--max-width);
    width: 95%;
    margin: var(--spacer-x1) auto;
}

.section-container {
    margin: 0 auto var(--spacer-Elements);
    max-width: var(--max-width);
    width: 95%;
    display: grid;
    grid-template-columns: repeat(2,1fr);
    gap: var(--spacer-x1);
}

h1 {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
}

#specielTid {
  border: 1px solid var(--color-font-1);
  padding: var(--spacer-x1);
  margin: var(--spacer-x1);
  background-color: var(--color-pricetable);
}

.fat-text {
    font-weight: 700;
    min-width: fit-content;
}

.flex-column {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-x1);
    width: 100%;
}

span {
  font-size: 1rem;
  line-height: 1.5;
  max-width: 75ch;
  font-family: var(--font-text);
  color: var(--color-font-1);
}

.time-container {
    display: flex;
    flex-direction: row;
    gap: var(--spacer-x1);
    align-items: center;
    justify-content: space-between;
    max-width: 18.75rem;
}

.wrapper-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-x1);

}
figure {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: var(--spacer-x1);
}

figure .side-img {
    max-width: 43.75rem;
    max-height: 21.5rem;

}
figure .small-side-img {
    max-width: 40rem;
    max-height: 16rem;
}

.persondata-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-x1);
    max-width: 34rem;

}





</style>