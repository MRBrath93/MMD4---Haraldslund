<script setup>
// IMPORTS 
import TheHero from "../components/TheHero.vue";
import TheInternNavMotion from "../components/TheInternNavMotion.vue";
import TheBreadcrumb from "../components/TheBreadcrumb.vue";
import EntryPoint from '@/components/EntryPoint.vue';
import ImageHolder from '@/components/ImageHolder.vue';

 
import { ref, onMounted, onUnmounted } from "vue";


// FETCH DATA FRA STRAPI
onMounted(() => {
  Promise.all([
    fetch('https://popular-gift-b355856076.strapiapp.com/api/upload/files/68')
        .then(res => res.json())
        .then(data => {
            motionImage.value = data;
        }),
    fetch('https://popular-gift-b355856076.strapiapp.com/api/upload/files/36')
        .then(res => res.json())
        .then(data => {
            motionHeroImg.value = data;
        }),
    fetch('https://popular-gift-b355856076.strapiapp.com/api/upload/files/56')
        .then(res => res.json())
        .then(data => {
            motionscenterImg.value = data;
        }),
    fetch('https://popular-gift-b355856076.strapiapp.com/api/upload/files/132')
        .then(res => res.json())
        .then(data => {
            teamCardImg.value = data;
            console.log(data.data.attributes.coverbillede);
        }),
    fetch('https://popular-gift-b355856076.strapiapp.com/api/upload/files/133')
        .then(res => res.json())
        .then(data => {
            sbImg.value = data;
        }),
    ])
    .catch (err => {
    error.value = "Beklager, der opstod en fejl under indlæsning af data.";
  }) 
  .finally (() =>{
    isLoading.value = false;
  });

  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});


onUnmounted(() => {
window.removeEventListener("resize", checkScreenSize);
});

// INTERN NAVIGATION LABELS (FRA STRAPI)
const internNavLabels = [
  { id: 1, label: "Om Motionscenteret", name: "om-motionscenteret" },
  { id: 2, label: "Holdoversigt", name: "holdoversigt-motionscenteret" },
  { id: 3, label: "Priser", name: "priser-motionscenteret" },
  { id: 4, label: "Regler", name: "regler-motionscenteret" },
  { id: 5, label: "Personlig træning", name: "personlig-traening-motionscenteret" },
  { id: 6, label: "Leje af sal & instruktør", name: "leje-af-sal-og-instruktor-motionscenteret" },
  { id: 7, label: "Sundhed & bevægelse", name: "sib-motionscenteret" },
];

// REAKTIVE VARIABLER
const motionImage = ref ({});
const motionHeroImg = ref ({});
const motionscenterImg = ref ({});
const teamCardImg = ref ({});
const sbImg = ref ({});
const isLoading = ref(true);
const error = ref(null);


// FUNKTIONER

function getImage(billede) {
  if (!billede || !billede.formats) return '';
  return billede.formats.large?.url ||
  billede.formats.medium?.url ||
  billede.formats.small?.url ||
  billede.formats.thumbnail?.url ||
  billede.url || '';
}

const isScreenLarge = ref(false);

function checkScreenSize() {
isScreenLarge.value = window.innerWidth >= 768;
}

</script>

<template>
    <main>
        <TheHero
            title="HARALDSLUND"
            subtitle="Motion"
            description="Læs om vores motionstilbud og holdoversigt. Find praktisk information om motionscenteret, herunder faciliteter, priser og holdbeskrivelser."
            :image="getImage(motionHeroImg)"
            :alt="motionHeroImg.alternativeText || 'Motionscenter billede'"/>
        <TheBreadcrumb/>
        <TheInternNavMotion 
        :labels="internNavLabels" />
        <section class="flex-row-container">
            <article class="flex-column-container">
                <div>
                    <h3>Haraldslund motionscenter - Gør noget godt for dig selv</h3>
                    <p>Hos Haraldslund finder du et bredt udvalg af motionstilbud, der henvender sig til alle - uanset alder, niveau eller 
                    forudsætninger. Vores motionscenter rummer alt hvad du behøver til din træning.</p>
                </div>
                <div>
                    <h3>Holdtræning - Fællesskab og bevægelse i ét hus</h3>
                    <p>Vi tilbyder et bredt udvalg af holdtræninger, med noget for alle niveauer og interesser. 
                    Fra puls og power til rolig bevægelse og balance - her er plads til din udvikling og dit tempo. </p>
                </div>
                <div>
                    <h3>Sundhed og Bevægelse - Med plads til forskellighed</h3>
                    <p>Vi tilbyder også sundheds- og bevægelsestilbud for borgere med særlige behov. Her er der fokus på tryghed, fællesskab og individuel tilpasning. 
                    Vores dygtige instruktører sikrer, at alle får mulighed for at bevæge sig og tage del i et aktivt fællesskab.</p>
                </div>
            </article>
            <aside class="img-container">
                <ImageHolder class="aside-image" v-if="motionImage" :src="getImage(motionImage)" :alt="motionImage.alternativeText || 'Motionscenter billede'" ></ImageHolder>
            </aside>
        </section> 
        
        <section>
            <h2 class="text-align-center">Din tid, din træning - vælg det tilbud der passer dig</h2>
            <div class="card-container">
                <EntryPoint 
                    class="entrypoint" 
                    icon="arrow_forward" 
                    color="green" 
                    title="Motionscenter" 
                    :bgimage= "isScreenLarge ? getImage(motionscenterImg) : ''"
                    name="om-motionscenteret">
                </EntryPoint>
                <EntryPoint 
                    class="entrypoint" 
                    id="teamImage" 
                    icon="arrow_forward" 
                    color="green" 
                    title="Holdoversigt"
                    :bgimage= "isScreenLarge ? getImage(teamCardImg) : ''"
                    name="holdoversigt-motionscenteret">
                </EntryPoint>
                <EntryPoint 
                    class="entrypoint" 
                    icon="arrow_forward" 
                    color="green" 
                    title="Sundhed & Bevægelse" 
                    :bgimage= "isScreenLarge ? getImage(sbImg) : ''"
                    name="sib-motionscenteret">
                </EntryPoint>
            </div>
           
        </section>  
    </main>
</template>

<style scoped>

main{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.router-link-active {
  text-decoration: underline;
  text-underline-offset: 0.5rem;
}

.flex-column-container{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--spacer-x2);
}

.aside-image{
    width: 100%;
    max-width: 40rem;
    height: auto;
}

.img-container {
    padding: var(--spacer-x2);
}


.text-align-center{
    text-align: center;
}

.card-container{
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacer-x2);
    width: 100vw;
 
    margin: 0 auto;
    padding-bottom: var(--spacer-x6-5);
}

.entrypoint {
    width: 100%;
    height: 100%;
    min-height: 5rem;
    background-color: var(--color-motion);
}


#teamImage ::v-deep(.bg-layer)  {
    background-position: top center;
}

@media screen and (min-width: 768px) {
    .flex-row-container{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    max-width: 1432px;
    margin: 0 auto;
    gap: var(--spacer-x4);
}
 
.card-container{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    max-width: 1432px;
    height: auto;
    padding: var(--spacer-x2);
}

.entrypoint {
    max-height: 20.6rem;
    min-height: 12.5rem;
    max-width: 27.5rem;
  }
}

</style>