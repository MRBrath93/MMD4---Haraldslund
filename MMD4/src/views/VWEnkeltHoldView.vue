<script setup>
import { ref, watchEffect, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useClassesStoreWater } from '@/stores/water-classes';

const route = useRoute();
const classesStore = useClassesStoreWater();

const classId = Number(route.params.id);
const selectedClass = ref(null);

onMounted(() => {
  if (classesStore.classes.length === 0) {
    classesStore.fetchClasses();
  }
});

watchEffect(() => {
  if (!classesStore.isLoading) {
    selectedClass.value = classesStore.getClassById(classId);
  }
});
</script>

<template>
  <div v-if="classesStore.isLoading">
    <p>Loader data...</p>
  </div>

  <div v-else-if="selectedClass">
    <h3>Dette er holdet: {{ selectedClass.name }}</h3>
    <p>ID: {{ selectedClass.id }}</p>
    <p>Varighed: {{ selectedClass.varighed }}</p>
    <p>Aflysning: {{ selectedClass.aflysning }}</p>
    <p v-for=" tekst in selectedClass.indhold.afsnit" :key="tekst.id">Aflysning: {{ tekst.overskrift }}</p>
    <p>Kategori: {{ selectedClass.type_af_hold }}</p>
  </div>

  <div v-else>
    <p>Holdet med ID {{ $route.params.id }} blev ikke fundet.</p>
  </div>
</template>


<style scoped>
div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
}
</style>
