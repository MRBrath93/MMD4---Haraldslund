<script setup>
import TheBtn from '@/components/TheBtn.vue';
import QuickInfo from '@/components/QuickInfo.vue';
import BookingSquare from '@/components/BookingSquare.vue';
import EntryPoint from '@/components/EntryPoint.vue';
import imgMeet from '@/assets/images/2024-Haraldslund_Wellness_015.jpg'
import imgWell from '@/assets/images/2024-Haraldslund_Wellness_041.jpg'
import imgSvom from '@/assets/images/svomme.jpg'
import imgMot from '@/assets/images/motion.jpg'
import Image1 from '../assets/images/svomme.jpg';
import Reklamekort from '@/components/Reklamekort.vue';

import TheHero from '@/components/TheHero.vue';
import RushHoursHaraldslund from '@/components/RushHoursHaraldslund.vue';
import ImageHolder from '@/components/ImageHolder.vue';
import { ref, onMounted } from 'vue';

const forsideData = ref(null);
const isLoading = ref(true);
const error = ref(null);

onMounted(() => {
  fetch('https://popular-gift-b355856076.strapiapp.com/api/forside?pLevel')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP fejl! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      forsideData.value = data.data;
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
  return billede.formats.large?.url ||
  billede.formats.medium?.url ||
  billede.formats.small?.url ||
  billede.formats.thumbnail?.url ||
  billede.url || '';
}
</script>

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
    padding: var(--spacer-x1);
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
    gap: var(--spacer-x1);
    margin-top: var(--spacer-x2);
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
}

th, td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
}

th {
    background-color: #f2f2f2;
}


@media screen and (min-width: 500px) {
    .four--column-grid{
        gap: 1rem;
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
}

@media screen and (min-width: 1000px) {

    .four--column-grid{
        grid-template-columns: repeat(4,1fr);
        height: 300px;
    }
}

</style>

<template>
    <body>
        <main v-if="isLoading">Indlæser...</main>
        <main v-else-if="error">Der opstod en fejl: {{ error }}</main>
        <main v-else v-for="tekstsektion in forsideData.Indhold.Afsnit" :key="tekstsektion.id">

            <TheHero :title="forsideData.Hero_sektion.Hero_titel_h5.Titel_H5" :subtitle="forsideData.Hero_sektion.Hero_undertitel_h6.Undertitel_H6" :image="forsideData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].url" :alt="forsideData.Hero_sektion.Hero_Baggrundsbillede.Billede[0].alternativeText"></TheHero>

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
                        <TheBtn v-for="btn in tekstsektion.Knapper" :key="btn.id" :title="btn.btn_titel" :text="btn.btn_description" :icon="btn.Ikon[0]" ></TheBtn>
                    </div>
                </article>
                <div class="img--container flex1" v-for="billede in tekstsektion.Billede" :key="billede.id">
                    <ImageHolder class="img" :src="getImage(billede)" :alt="billede.alternativeText"></ImageHolder>
                </div>
            </section>
            <section>
                <h2 class="text-align-center">Udforsk vores tilbud</h2>
                <div class="four--column-grid">
                    <EntryPoint icon="arrow_forward" color="blue" title="Svømmehal" :bgimage="imgSvom" name="svommehallen-vandogwellness"></EntryPoint>
                    <EntryPoint icon="arrow_forward" color="purple" title="Wellness" :bgimage="imgWell" name="vandogwellness"></EntryPoint>
                    <EntryPoint icon="arrow_forward" color="green" title="Motion" :bgimage="imgMot" name="motion"></EntryPoint>
                    <EntryPoint icon="arrow_forward" color="brown" title="Møder & Konferencer" :bgimage="imgMeet" name="moder-og-konferencer"></EntryPoint>
                </div>
            </section>
            <section class="overview-container">
            <h2>Det sker i Haraldslund</h2>
            <table>
                <caption>Aktivitetsoversigt for denne uge</caption>
                <thead>
                    <tr>
                        <th>Aktivitet</th>
                        <th>Dato</th>
                        <th>Tidspunkt</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Vandgymnastik</td>
                        <td>15. maj 2025</td>
                        <td>10:00 - 11:00</td>
                    </tr>
                    <tr>
                        <td>Yoga</td>
                        <td>15. maj 2025</td>
                        <td>12:00 - 13:00</td>
                    </tr>
                    <tr>
                        <td>Svømning</td>
                        <td>15. maj 2025</td>
                        <td>14:00 - 16:00</td>
                    </tr>
                </tbody>
            </table>
            <RushHoursHaraldslund></RushHoursHaraldslund>
        </section>
        <h2>Forside</h2>
        <TheBtn title="Motion" text="Se vores faciliteter og priser" icon="arrow_forward"></TheBtn>
        <br>
        <TheBtn title="Motion" text="Se vores faciliteter og priser" link="https://www.erdetfredag.dk/" target="_blank" icon="arrow_forward"></TheBtn>
        <br>
        <TheBtn title="Motion" text="Se vores faciliteter og priser" link="/motion" icon="arrow_forward"></TheBtn>
        <br>

        <Reklamekort :src="Image1" alt="En beskrivelse af billedet" title="Velkommen til Haraldslund" text="Haraldslund er mere end et sted, hvor du kan svømme, træne og slappe af. Bag murene gemmer der sig en fortælling, der rækker langt tilbage i tiden - om fællesskab, fremsyn og folkelig vilje. I dag er Haraldslund et samlingspunkt for byens borgere - men historien om, hvordan det hele begyndte, er både rørende og inspirerende." :Btn="{ Btn_title: 'Læs mere', Btn_text: 'Klik her', Btn_link: '/om-haraldslund_café-harald', Btn_icon: 'arrow_forward', Btn_target: '_self'}"></Reklamekort>
        
        <section class="two--column-grid">
            <QuickInfo class="overview" time="45 min" pris="50 kr." praticalInfo="Mød op 10 minutter før start" cancelBooking="Senest 2 timer før start" kategori="Svømmehal"></QuickInfo>
            <bookingSquare title="Sådan tilmelder du dig" text="Du kan tilmelde dig gennem vores online booking system via. nedenstående link." btn_title="Booking" btn_text="Du kan booke dig ind lige her" kategori="Motion" btn_path="/motion" btn_icon="arrow_forward"></BookingSquare>
            <bookingSquare title="Til- & Afmeldingsfrister" text="Er du forhindret i at deltage på holdet? Sørg for at melde afbud i rette tid." kategori="Wellness" btn_title="Til- & Afmeldingsfrister" btn_text="Få styr på diverse frister" btn_path="/motion" btn_icon="arrow_forward"></BookingSquare>
        </section>
        </main>
    </body>
</template>