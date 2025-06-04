<script setup>

// IMPORTS 
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import TheInternNavHaraldslund from "@/components/TheInternNavHaraldslund.vue";


// INTERN NAVIGATION LABELS (FRA STRAPI)
const internNavLabels = [
  { id: 1, label: "Om Motionscenteret", name: "om-motionscenteret" },
  { id: 2, label: "Holdoversigt", name: "holdoversigt-motionscenteret" },
  { id: 3, label: "Priser", name: "priser-motionscenteret" },
  { id: 4, label: "Regler", name: "regler-motionscenteret" },
  { id: 5, label: "Personlig træning", name: "personlig-traening-motionscenteret" },
  { id: 6, label: "Leje af sal & instruktør", name: "leje-af-sal-og-instruktor-motionscenteret" },
  { id: 7, label: "Sundhed i bevægelse", name: "sib-motionscenteret" },
];

</script>

<template>
    <div class="wrapper">
        <TheBreadcrumb></TheBreadcrumb>  
        <TheInternNavHaraldslund :label="internNavLabels"></TheInternNavHaraldslund>
        <section>
            <h1>SUNDHED I BEVÆGELSE</h1>
            <h2>En del af vores afgrænsning</h2>
        </section>
    </div>
</template>

<style scoped>
.wrapper {
    width: 95%;
}

div{
    height: 100vh;
    max-width: var(--max-width);
    margin: var(--spacer-Elements) auto;
}

section {
    text-align: center;
}
</style>