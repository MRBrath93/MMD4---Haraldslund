<script setup>
import { useClassesStore } from "../stores/classes.js";
const classesStore = useClassesStore();

</script>

<template>
    <div>
        <h1>Her er nogle fede hold</h1>
        <p>Der er {{ classesStore.numberOfClasses }} hold på denne liste</p>

        <div class="classesIndex">
          <div class="Card" v-for="hold in classesStore.classes" :key="hold.id">
            <h3>{{ hold.name }}</h3>
            <p>{{ hold.description }}</p>
          </div>
        </div>
    </div>
</template>

<style scoped>
img{
  height: 200px;
}

.Card{
  background-color: rgb(71, 137, 102);
  color: white;
  padding: 1rem;
  margin: 1rem;
  border-radius: 12px;
  text-align: center;
}

.classesIndex{
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 0.5rem;

}
</style>