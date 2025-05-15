<script setup>
import { ref, onMounted } from "vue";
import { useClassesStoreMotion } from "@/stores/motion-classes.js";

import TheHero from "@/components/TheHero.vue";
import TheInternNavMotion from "@/components/TheInternNavMotion.vue";
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import ImageHolder from "@/components/ImageHolder.vue";
import Reklamekort from "@/components/Reklamekort.vue";
import TheTeamCard from "@/components/TheTeamCard.vue";

// const classesStore = useClassesStoreMotion();

// onMounted(() => {
  // classesStore.fetchClasses();
  // console.log(classesStore.classes.coverbillede);

  onMounted(() => {
  fetch('https://popular-gift-b355856076.strapiapp.com/api/hold-motions?pLevel')
  .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP fejl! Status: ${response.status}`);
      }
      return response.json();
    })    
    .then(data => {
        holdMotionData.value = data.data;   
    })
    .catch(err => {
      error.value = err.message;
    })
    .finally(() => {
      isLoading.value = false;
    });

});

const holdMotionData = ref(null);
const isLoading = ref(true);
const error = ref(null);


const internNavLabels = [
  { id: 1, label: "Om Motionscenteret", name: "om-motionscenteret" },
  { id: 2, label: "Holdoversigt", name: "holdoversigt-motionscenteret" },
  { id: 3, label: "Priser", name: "priser-motionscenteret" },
  { id: 4, label: "Regler", name: "regler-motionscenteret" },
  { id: 5, label: "Personlig træning", name: "personlig-traening-motionscenteret" },
  { id: 6, label: "Leje af sal & instruktør", name: "leje-af-sal-og-instruktor-motionscenteret" },
  { id: 7, label: "Sundhed & bevægelse", name: "sib-motionscenteret" },
];


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
    <div>
        <h1>Motionscenter Holdoversigt</h1>
        <TheHero
          title="HARALDSLUND"
          subtitle="Holdoversigt"
          description="Læs om vores moderne motionscenter."
          />
        <TheBreadcrumb/>
        <TheInternNavMotion
        :labels="internNavLabels" />

        <p>Haraldslund Motionscenter tilbyder desuden mange spændende holdaktiviteter både på land og i vand, hvor du sammen med 
          andre kan træne eksempelvis styrke og kondition, eventuelt kombineret med din individuelle træning i centeret.</p>
        <p>Flere gange om året revideres vores holdplan, således at vi altid har spændende og aktuelle aktiviteter på programmet.</p>

        <section>
          <i class="material-symbols-rounded">filter_alt</i><h4>Kategorier:</h4>
          
        </section>
        <section>
          <TheTeamCard
            link="/motion"
            colors="var(--color-motion)"
            label="Motion"
            overlayText="Tryk for at gå til holdbeskrivelse"
            :labels="{ title: 'motion', label: 'Motion', color: 'var(--color-motion)' }"
            icon="arrow_forward"
            backgroundColor="var(--color-motion)"
            :teamImage="getImage(holdMotionData.Cover_Billedet)"/>
        </section>


        <!-- <p>Her har vi {{ classesStore.numberOfClasses }} hold</p>

        <div v-for="klasse in classesStore.classes" :key="klasse.id">
            <h3>{{ klasse.name }}</h3>
            <img class="cover" :src="getCoverImage(klasse)" alt="Cover Image" />
            <p v-for="kategori in klasse.kategorier" :key="kategori.id ">{{ kategori }}</p>
            <div v-for="hold in klasse.relateredeHold" :key="hold.id">
                <p>{{ hold.name }}</p>
                <img class="minicover" :src="getCoverImage(hold)" alt="Cover Image" />
            </div>

        <div v-for="tekstsektion in klasse.indhold.afsnit" :key="tekstsektion.id">
    
                <h4>{{ tekstsektion.overskrift }}</h4>
                <h5 v-for="subtitle in tekstsektion.tekst" :key="subtitle.id">{{ subtitle.underoverskrift }}</h5>
                <p v-for="paragraph in tekstsektion.tekst" :key="paragraph.id">{{ paragraph.brodtekst }}</p>
        </div>
      </div> -->
    </div>

    <!-- <TheTeamCard 
    link="/motion"
    colors="var(--color-motion)"
    label="Motion"
    overlayText="Tryk for at gå til holdbeskrivelse"
    :labels="{ title: 'motion', label: 'Motion', color: 'var(--color-motion)' }"
    icon="arrow_forward"
    backgroundColor="var(--color-motion)"
    :teamImage="teamImage"/> -->
  
</template>

<style scoped>
main{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.cover{
height: 200px;
}

.minicover{
    height: 50px;
}
</style>