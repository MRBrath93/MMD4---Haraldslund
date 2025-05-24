<script setup>

// IMPORTS 
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import TheInternNavMotion from "../components/TheInternNavMotion.vue";


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

</script>

<template>
    <h1>SUNDHED I BEVÆGELSE</h1>
    <TheBreadcrumb />  
    <TheInternNavMotion :labels="internNavLabels" />
    <h2>... Maybe next time? </h2>
</template>

<style scoped>
main{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

section {
    margin-top: var(--spacer-x5);
    margin-bottom: var(--spacer-x5);
}
</style>