<script setup>
import TheBtn from '@/components/TheBtn.vue';
import EntryPoint from '@/components/EntryPoint.vue';
import imgMeet from '@/assets/images/2024-Haraldslund_Wellness_015.jpg'
import imgWell from '@/assets/images/2024-Haraldslund_Wellness_041.jpg'
import imgSvom from '@/assets/images/svomme.jpg'
import imgMot from '@/assets/images/motion.jpg'
</script>

<template>
    <main>
        <h2>Forside</h2>
        <TheBtn title="Motion" text="Se vores faciliteter og priser" icon="arrow_forward"></TheBtn>
        <br>
        <TheBtn link="https://www.erdetfredag.dk/" title="Motion" text="Se vores faciliteter og priser" icon="arrow_forward"></TheBtn>
        <br>

        <div class="four--column-grid">
            <EntryPoint icon="arrow_forward" color="blue" title="Svømmehal" :bgimage="imgSvom" name="svommehallen-vandogwellness"></EntryPoint>
            <EntryPoint icon="arrow_forward" color="purple" title="Wellness" :bgimage="imgWell" name="vandogwellness"></EntryPoint>
            <EntryPoint icon="arrow_forward" color="green" title="Motion" :bgimage="imgMot" name="motion"></EntryPoint>
            <EntryPoint icon="arrow_forward" color="brown" title="Møder & Konferencer" :bgimage="imgMeet" name="moder-og-konferencer"></EntryPoint>
        </div>
    </main>

</template>

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
    width: 100%;
    height: 300px;
    padding: 0 var(--spacer-x5);
}

@media screen and (max-width: 1200px) {
    .four--column-grid{
        grid-template-columns: repeat(2, 1fr);
        width: 100%;
        height: 400px;
        padding: 0 10rem;
    }
    
}
</style>