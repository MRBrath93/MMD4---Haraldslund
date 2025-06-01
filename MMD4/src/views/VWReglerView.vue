<script setup>
import TheHero from "../components/TheHero.vue";
import TheInternNavHaraldslund from "@/components/TheInternNavHaraldslund.vue";
import TheBreadcrumb from "../components/TheBreadcrumb.vue";
import TheSpinner from "@/components/TheSpinner.vue";
import TheBtn from '@/components/TheBtn.vue';
import Reklamekort from '@/components/Reklamekort.vue';
import ImageHolder from '@/components/ImageHolder.vue';
import DynamicHeading from '@/components/DynamicHeading.vue';
import { ref, onMounted } from 'vue';


const internNavLabels = [
    { id: 1, label: "Svømmehallen", name: "svommehallen-vandogwellness" },
    { id: 2, label: "Wellness", name: "wellness-vandogwellness" },
    { id: 3, label: "Holdoversigt", name: "holdoversigt-vandogwellness" },
    { id: 4, label: "Priser", name: "priser-vandogwellness" },
    { id: 5, label: "Regler", name: "regler-vandogwellness" },
];


const vwReglerData = ref([]);
const isLoading = ref(true);
const error = ref(null);

const CACHE_DURATION_MS = 5 * 60 * 1000;

onMounted(() => {
  isLoading.value = true;
  error.value = null;

  const cachedvwReglerRaw = localStorage.getItem('vwReglerData ');
  const cachedTimestampRaw = localStorage.getItem('cachereglerTimestamp');
  const now = Date.now();

  if (cachedvwReglerRaw && cachedTimestampRaw) {
    const cachedTimestamp = Number(cachedTimestampRaw);

    if (now - cachedTimestamp < CACHE_DURATION_MS) {
      try {
        vwReglerData .value = JSON.parse(cachedvwReglerRaw);
        isLoading.value = false;
        return;
      } catch (e) {
        console.warn('Fejl ved parsing af cached data:', e);
      }
    }
  }

  fetch('https://popular-gift-b355856076.strapiapp.com/api/regler-vand-og-wellness?pLevel')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Vand og Wellness - Regler fejl: ${response.status}`);
      }
      return response.json();
    })
    .then(json => {
      vwReglerData .value = json.data;
      localStorage.setItem('vwReglerData ', JSON.stringify(vwReglerData .value));
      localStorage.setItem('cachereglerTimestamp', now.toString());
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
        :title="vwReglerData .Hero_sektion.Hero_titel_h5.Titel_H5"
        :subtitle="vwReglerData .Hero_sektion.Hero_undertitel_h6.Undertitel_H6"
        :image="vwReglerData .Hero_sektion.Hero_Baggrundsbillede.Billede[0].url"
        :alt="vwReglerData .Hero_sektion.Hero_Baggrundsbillede.Billede[0].alternativeText"></TheHero>

        <TheBreadcrumb></TheBreadcrumb>
        <TheInternNavHaraldslund
            :label="internNavLabels"
        ></TheInternNavHaraldslund>
        
        <section class="textsection" v-for="(tekstsektion,index) in vwReglerData .Indhold.Afsnit" :key="tekstsektion.id">
                <article class="flex--column flex1">
                    <DynamicHeading :level="index === 0 ? 1 : 2">{{ tekstsektion.Overskrift }}</DynamicHeading>
                    <div v-for="single_text in tekstsektion.Tekst || []" :key="single_text.id">
                        <h3 class="subtitle" v-if="single_text.Underoverskift">{{ single_text.Underoverskift }}</h3>
                        <ul class="punkt" v-if="single_text.Skal_det_punktopstilles">
                            <li> {{ single_text.Brodtekst }}</li>
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
            <!-- BILLEDEREFERENCER: 
         Ordensregler: Facebook: Haraldslund Vand og Kulturhus. 02/05/2024. (online) Facebook.com. Meta 2025. [Accessed 07/05/2025] URL: https://www.facebook.com/photo.php?fbid=1100666694865842&set=pb.100047675655563.-2207520000&type=3
         Hygiejneregler: KM, #1186689339. Adobe Stock 2025. (online) Adobe [Accessed 12/05/2025] URL: https://stock.adobe.com/dk/images/fresh-white-towels-hanging-on-chrome-rack-in-modern-gym-locker-room-illuminated-by-warm-sunlight-clean-and-inviting-atmosphere-enhances-relaxation-and-comfort/1186689339
         -->
        </section>
        
        <Reklamekort 
        :src="getImage(vwReglerData .reklame_kort.Billede)" 
        :alt="vwReglerData .reklame_kort.Billede.alternativeText" 
        :title="vwReglerData .reklame_kort.Titel" 
        :text="vwReglerData .reklame_kort.Tekst_afsnit" 
        :Btn_title="vwReglerData .reklame_kort.Knapper[0].btn_titel" 
        :Btn_text="vwReglerData .reklame_kort.Knapper[0].btn_description" 
        :kategori="vwReglerData .reklame_kort.Kategori" 
        :Btn_icon="vwReglerData .reklame_kort.Knapper[0].Ikon[0]"></Reklamekort>
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
  gap: var(--spacer-x1);
  margin: 0 auto;
  margin-bottom: var(--mobile-site-space);
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

    .textsection {
        gap: var(--spacer-x2);
        margin-bottom: var(--spacer-Elements);
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
</style>