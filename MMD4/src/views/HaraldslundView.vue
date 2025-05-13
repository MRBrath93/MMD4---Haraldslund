<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import TheHero from "../components/TheHero.vue";
import image from "../assets/images/svomme.jpg";

import TheInternNavHaraldslund from "../components/TheInternNavHaraldslund.vue";
import TheBreadcrumb from "../components/TheBreadcrumb.vue";


const internNavLabels = [
{ id: 1, label: "Praktisk Information", name: "haraldslund-praktisk-info" },
{ id: 2, label: "Prisoversigt", name: "haraldslund-priser" },
{ id: 3, label: "Café Harald", name: "haraldslund-café" },
{ id: 4, label: "Personale", name: "'haraldslund-personale" },
{ id: 5, label: "Historien", name: "haraldslund-historie" },
{ id: 5, label: "Bibliotek", name: "haraldslund-bibliotek" },
{ id: 5, label: "Firmaaftaler", name: "haraldslund-firmaaftaler" },
{ id: 5, label: "Brugerråd", name: "Brugerraad - Haraldslund" },
{ id: 5, label: "Aktivitetsoversigt", name: "#" },
];

</script>

<template>
    <main>
        <TheHero
            title="HARALDSLUND"
            subtitle="Om Haraldslund"
            description="Find praktisk information om Haraldslund, herunder åbningstider, adresse og kontaktoplysninger."
            :image="image"
            alt="Haraldslund Vand og kulturhus"/>
        <TheBreadcrumb />
        <h2>Om Haraldslund</h2>
        <TheInternNavHaraldslund />
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