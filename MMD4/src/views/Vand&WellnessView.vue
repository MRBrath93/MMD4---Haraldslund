<script setup>
import TheHero from "../components/TheHero.vue";
import TheInternNavWater from "../components/TheInternNavWater.vue";
import TheBreadcrumb from "../components/TheBreadcrumb.vue";
import image from "../assets/images/svomme.jpg";

const internNavLabels = [
    { id: 1, label: "Svømmehallen", name: "svommehallen-vandogwellness" },
    { id: 2, label: "Wellness", name: "wellness-vandogwellness" },
    { id: 3, label: "Holdoversigt", name: "holdoversigt-vandogwellness" },
    { id: 4, label: "Priser", name: "priser-vandogwellness" },
    { id: 5, label: "Regler", name: "regler-vandogwellness" },
];


</script>

<template>
    <div>
        <TheHero
            title="HARALDSLUND"
            subtitle="Vand & Wellness"
            description="Oplev vores svømmehal og wellnessområde med sauna og dampbad."
            :image="image"
            alt="Vand & Wellness"></TheHero>
        <TheBreadcrumb></TheBreadcrumb>
        <h1>Vand & Wellness</h1>
        <TheInternNavWater
            :label="internNavLabels"
        ></TheInternNavWater>
    </div>
 

</template>

<style scoped>

</style>