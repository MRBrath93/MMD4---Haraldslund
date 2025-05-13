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
import RushHoursHaraldslund from '@/components/RushHoursHaraldslund.vue';
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
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    width:95%;
    height: 300px;
    max-width: 1432px;
}

.two--column-grid{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
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
}

@media screen and (max-width: 1200px) {
    .four--column-grid{
        grid-template-columns: repeat(2, 1fr);
        height: 400px;
    }
}

@media screen and (max-width: 1000px) {
    .four--column-grid{
        height: 400px;
    }
}

@media screen and (max-width: 700px) {
    .two--column-grid{
        grid-template-columns: 1fr;
    }
}

@media screen and (max-width: 1000px) {
    .four--column-grid{
        height: 400px;
    }
}

@media screen and (max-width: 500px) {
    .four--column-grid{
        height: 300px;
        gap: 0.5rem;
    }
}
</style>

<template>
    <main>
        <section class="overview-container">
            <h2>Det sker i Haraldslund</h2>
            <RushHoursHaraldslund></RushHoursHaraldslund>
        </section>
        <h2>Forside</h2>
        <TheBtn title="Motion" text="Se vores faciliteter og priser" icon="arrow_forward"></TheBtn>
        <br>
        <TheBtn title="Motion" text="Se vores faciliteter og priser" link="https://www.erdetfredag.dk/" target="_blank" icon="arrow_forward"></TheBtn>
        <br>
        <TheBtn title="Motion" text="Se vores faciliteter og priser" link="/motion" icon="arrow_forward"></TheBtn>
        <br>

        <div class="four--column-grid">
            <EntryPoint icon="arrow_forward" color="blue" title="Svømmehal" :bgimage="imgSvom" name="svommehallen-vandogwellness"></EntryPoint>
            <EntryPoint icon="arrow_forward" color="purple" title="Wellness" :bgimage="imgWell" name="vandogwellness"></EntryPoint>
            <EntryPoint icon="arrow_forward" color="green" title="Motion" :bgimage="imgMot" name="motion"></EntryPoint>
            <EntryPoint icon="arrow_forward" color="brown" title="Møder & Konferencer" :bgimage="imgMeet" name="moder-og-konferencer"></EntryPoint>
        </div>


        <Reklamekort :src="Image1" alt="En beskrivelse af billedet" title="Velkommen til Haraldslund" text="Haraldslund er mere end et sted, hvor du kan svømme, træne og slappe af. Bag murene gemmer der sig en fortælling, der rækker langt tilbage i tiden - om fællesskab, fremsyn og folkelig vilje. I dag er Haraldslund et samlingspunkt for byens borgere - men historien om, hvordan det hele begyndte, er både rørende og inspirerende." :Btn="{ Btn_title: 'Læs mere', Btn_text: 'Klik her', Btn_link: '/om-haraldslund_café-harald', Btn_icon: 'arrow_forward', Btn_target: '_self'}"></Reklamekort>
        
        <section class="two--column-grid">
            <QuickInfo class="overview" time="45 min" pris="50 kr." praticalInfo="Mød op 10 minutter før start" cancelBooking="Senest 2 timer før start" kategori="Svømmehal"></QuickInfo>
            <bookingSquare title="Sådan tilmelder du dig" text="Du kan tilmelde dig gennem vores online booking system via. nedenstående link." btn_title="Booking" btn_text="Du kan booke dig ind lige her" kategori="Motion" btn_path="/motion" btn_icon="arrow_forward"></BookingSquare>
            <bookingSquare title="Til- & Afmeldingsfrister" text="Er du forhindret i at deltage på holdet? Sørg for at melde afbud i rette tid." kategori="Wellness" btn_title="Til- & Afmeldingsfrister" btn_text="Få styr på diverse frister" btn_path="/motion" btn_icon="arrow_forward"></BookingSquare>
        </section>
    </main>

</template>