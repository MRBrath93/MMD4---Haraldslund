<script setup>
import TheInternNavHaraldslund from "../components/TheInternNavHaraldslund.vue";
import TheBreadcrumb from "../components/TheBreadcrumb.vue";

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

</script>

<template>
    <div>
        <TheBreadcrumb></TheBreadcrumb>  
        <div class="content-container">
            <TheInternNavHaraldslund :label="internNavLabels"></TheInternNavHaraldslund>
        </div>
        <section>
            <h1>Firmaaftaler</h1>
            <h2>... Maybe next time? </h2>
        </section>
    </div>
</template>

<style scoped>
div{
    height: 100vh;
    max-width: var(--max-width);
    margin: 0 auto;
}

section {
    margin-bottom: var(--spacer-x5);
    text-align: center;
}

.content-container{
    width: 100%;
    max-width: var(--max-width);
    padding-bottom: var(--spacer-x5);
    position: relative;
    height: fit-content;
}

@media screen and (max-width: 400px) {
    .content-container {
        width: 100vw;
    }

    .intern-nav {
        margin: 0;
        width: 100%;
    }
   
}

</style>