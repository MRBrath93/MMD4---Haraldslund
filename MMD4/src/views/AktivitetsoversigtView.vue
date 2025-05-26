<script setup>
// IMPORTS 
import { ref, onMounted } from "vue";
import TheInternNavHaraldslund from "../components/TheInternNavHaraldslund.vue";
import TheBreadcrumb from "../components/TheBreadcrumb.vue";
import TheHero from "../components/TheHero.vue";
import TheSpinner from "../components/TheSpinner.vue";
import RushHoursHaraldslund from '@/components/RushHoursHaraldslund.vue';

// REAKTIVE VARIABLER
const isLoading = ref(true);
const error = ref(null);


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
    <div v-if="isLoading">        
        <TheSpinner>
            <span class="material-icons">sports_gymnastics</span>
        </TheSpinner>
    </div>
    <div v-else-if="error">Der opstod en fejl: {{ error }}</div>
    <div v-else>        
        <!-- <TheHero
        :title="HARALDSLUND"
        :subtitle="Aktivitetsoversigt"
        description="Læs praktisk information om Haraldslund Vand og Kulturhus"
        :image="getImage(praktiskData.Hero_sektion?.Hero_Baggrundsbillede?.Billede[0])"
        :alt="praktiskData.Hero_sektion.Hero_Baggrundsbillede?.data?.attributes?.alternativeText || 'Hero billede'" /> -->
        <h1> Aktivitetsoversigt </h1>
        <TheBreadcrumb></TheBreadcrumb>
        <TheInternNavHaraldslund
        :label="internNavLabels"></TheInternNavHaraldslund>
        <section>

        </section>
    </div>

</template>
<style scoped>

</style>