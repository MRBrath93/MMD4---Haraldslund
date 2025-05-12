<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import TheTeamCard from "../components/TheTeamCard.vue";
import teamImage from "../assets/images/svomme.jpg";
import TheInternNavMotion from "../components/TheInternNavMotion.vue";
import TheFooter from "../components/TheFooter.vue";
import TheBreadcrumb from "../components/TheBreadcrumb.vue";

const breadcrumbLabels = [
  { id: 0, label: "Forside", name: "frontpage" },
  { id: 1, label: "Om Motionscenteret ", name: "om-motionscenteret" },
  { id: 2, label: "Holdoversigt", name: "holdoversigt-motionscenteret" },
  { id: 3, label: "Priser ", name: "priser-motionscenteret" },
];

const breadcrumbsSeparator = " / ";


</script>

<template>

<TheBreadcrumb 
:labels="breadcrumbLabels" 
:separator="breadcrumbsSeparator" 
 />

<!-- <TheInternNavMotion
    :label="[
        'Om Motionscenteret',
        'Holdoversigt',
        'Priser',
        'Regler',
        'Personlig træning',
        'Leje af sal & instruktør',
        'Sundhed I bevægelse'
    ]"
    /> -->

<!-- <TheTeamCard 
    link="/motion"
    colors="var(--color-motion)"
    label="Motion"
    overlayText="Tryk for at gå til holdbeskrivelse"
    :labels="{ title: 'motion', label: 'Motion', color: 'var(--color-motion)' }"
    icon="arrow_forward"
    backgroundColor="var(--color-motion)"
    :teamImage="teamImage"/> -->

    <!-- <TheFooter /> -->

  


</template>

<style scoped>


.intern-nav {
  display: flex;
}
</style>