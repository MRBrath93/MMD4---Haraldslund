<script setup>
import TheInternNavMotion from "../components/TheInternNavMotion.vue";


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
    <main>
        <h2>OM MOTIONSCENTERET</h2>
        <img src="https://media.tenor.com/L-Y5H7y1R50AAAAM/gym-fall.gif" alt="" />
        
    <TheInternNavMotion
    :label="internNavLabels"
    />

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