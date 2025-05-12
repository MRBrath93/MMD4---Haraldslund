<script setup>
import { onMounted } from "vue";
import { useClassesStoreMotion } from "@/stores/motion-classes.js";

const classesStore = useClassesStoreMotion();

onMounted(() => {
  classesStore.fetchClasses();
  console.log(classesStore.classes.coverbillede);
});

// Funktion der bestemmer hvilket billede der skal vises
function getCoverImage(klasse) {
  if (klasse.coverbilledeMedium) {
    return klasse.coverbilledeMedium; // Hvis medium er tilgængeligt, brug det
  } else if (klasse.coverbilledeSmall) {
    return klasse.coverbilledeSmall; // Ellers brug small
  } else {
    return klasse.coverbilledeThumbnail; // Hvis ingen af dem er tilgængelige, brug thumbnail
  }
}
</script>

<template>
    <div>
        <h2>Motionshold</h2>
        <img src="https://media1.giphy.com/media/bF7z0iF8GmmBkNfeYL/giphy.gif?cid=6c09b952nvke9s151rhgfhv2bv9thhqh5byk4j6oaia95qq7&ep=v1_gifs_search&rid=giphy.gif&ct=g" alt="" />

        <p>Her har vi {{ classesStore.numberOfClasses }} hold</p>

        <div v-for="klasse in classesStore.classes" :key="klasse.id">
            <h3>{{ klasse.name }}</h3>
            <img class="cover" :src="getCoverImage(klasse)" alt="Cover Image" />
            <p v-for="kategori in klasse.kategorier" :key="kategori.id ">{{ kategori }}</p>
            <div v-for="hold in klasse.relateredeHold" :key="hold.id">
                <p>{{ hold.name }}</p>
                <img class="minicover" :src="getCoverImage(hold)" alt="Cover Image" />
            </div>

        <div v-for="tekstsektion in klasse.indhold.afsnit" :key="tekstsektion.id">
    
                <h4>{{ tekstsektion.overskrift }}</h4>
                <h5 v-for="subtitle in tekstsektion.tekst" :key="subtitle.id">{{ subtitle.underoverskrift }}</h5>
                <p v-for="paragraph in tekstsektion.tekst" :key="paragraph.id">{{ paragraph.brodtekst }}</p>
        </div>
      </div>
    </div>
</template>

<style scoped>
main{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.cover{
height: 200px;
}

.minicover{
    height: 50px;
}
</style>