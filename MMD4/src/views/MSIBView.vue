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
  { id: 7, label: "Sundhed & bevægelse", name: "sib-motionscenteret" },
];

</script>

<template>
    <div>
        <TheBreadcrumb></TheBreadcrumb>  
        <TheInternNavHaraldslund :label="internNavLabels"></TheInternNavHaraldslund>
        <section class="wrapper">
            <h1>SUNDHED I BEVÆGELSE</h1>
            <h2>... Maybe next time? </h2>
        </section>
    </div>
</template>

<style scoped>
div{
    height: 100vh;
    max-width: var(--max-width);
    margin: 0 auto;
    padding-top: var(--spacer-x5);
}

.wrapper {
    margin-bottom: var(--spacer-x5);
    text-align: center;
    padding-top: var(--spacer-x5);
}
</style>