<script setup>
import { onMounted } from "vue";
import { useClassesStore } from "@/stores/classes.js";

const classesStore = useClassesStore();

onMounted(() => {
  classesStore.fetchClasses();
});
</script>

<template>
    <main>
        <h2>Bibliotek</h2>
        <img src="https://i.pinimg.com/originals/d8/63/c4/d863c4a79ac053437beb6e18937cecc4.gif" alt="" />


        <li v-for="klasse in classesStore.classes" :key="klasse.id">
        <h3>{{ klasse.name }}</h3>
        <p>{{ klasse.id }}</p>
      </li>
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