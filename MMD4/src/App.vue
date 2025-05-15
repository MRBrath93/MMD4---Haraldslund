<script setup>
import { RouterView } from "vue-router";
import TheNav from "./components/TheNav.vue";
import { watch } from "vue";
import { useRoute } from "vue-router";
import TheFooter from "./components/TheFooter.vue";

const route = useRoute();

watch(() => route.meta.title, (title) => {
  if (title) document.title = title;
});
</script>

<template>
<body>
    <header>
        <TheNav></TheNav>
    </header>
    <main>
        <router-view></router-view>
    </main>
    <footer>
        <TheFooter></TheFooter>
    </footer>
</body>
</template>

<style scoped>

</style>
