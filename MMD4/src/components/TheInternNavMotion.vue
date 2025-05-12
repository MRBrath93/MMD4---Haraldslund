<script setup>

const props = defineProps ({
    label: {
        type: Array,
        default: () => [
      { id: 1, label: "Om Motionscenteret", name:"om-motionscenteret" },
      { id: 2, label: "Holdoversigt", name:"holdoversigt-motionscenteret" },
      { id: 3, label: "Priser", name:"priser-motionscenteret" },
      { id: 4, label: "Regler", name:"regler-motionscenteret" },
      { id: 5, label: "Personlig træning", name: "personlig-traening-motionscenteret" },
      { id: 6, label: "Leje af sal & instruktør", name: "leje-af-sal-og-instruktor-motionscenteret" },
      { id: 7, label: "Sundhed & bevægelse", name:"sib-motionscenteret" },
    ], 
    },
});



</script>
<template>
    <section class="intern-nav">
        <ul class="small intern-nav-container">
            <li v-for="(item, index) in label" :key="index">
                <router-link :to="{ name: item.name }">
                    <span>{{ item.label }}</span>
                </router-link>
            </li>
        </ul>
    </section>
</template>

<style scoped>
.intern-nav {
    margin: 0 auto;
    position: sticky;
    top: 0px;
    z-index: 1;
    padding: var(--spacer-x1);
    background-color: var(--color-body-background);
    width: 100vw;
}

.intern-nav-container {
    display: flex;
    gap: var(--spacer-x3);
    justify-content: center;
}

li {
    list-style-type: none;
    color: var(--color-font-1);
    font-weight: 500;
}

li:hover {
    text-decoration: underline;
    cursor: pointer;
    text-underline-offset: var(--spacer-x0-5);
}

.router-link-exact-active {
    text-decoration: underline;
    text-underline-offset: var(--spacer-x0-5);
}

@media  screen and (max-width: 1200px) {
    .intern-nav-container {
        flex-direction: column;
        gap: var(--spacer-x1);
    }
    .intern-nav {
        padding: var(--spacer-x0-5);
    }
    
}


</style>

<!-- INSPIRATIONSKILDE: Atakan COSKUNDERE. Vue.js Dynamic Breadcrumb. Published 07/09/2020 Istanbul. (online) [Accessed 12/05/25] URL:https://www.youtube.com/watch?v=yL2z3oUr-So -->
<!-- INSPIRATIONSKILDE: Evan You, Eduardo San Martin Morote. Vue Router. 2014. (online) [Accessed 12/05/2025] URL: https://router.vuejs.org/guide/essentials/navigation.html#Programmatic-Navigation -->

