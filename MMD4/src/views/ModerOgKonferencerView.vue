<script setup>
import TheBreadcrumb from '@/components/TheBreadcrumb.vue';
</script>

<template>
    <div>
        <TheBreadcrumb></TheBreadcrumb>
        <section>
            <h1>Møder & Events</h1>
            <h2>... Maybe next time? </h2>
        </section>
    </div>
</template>

<style scoped>
div{
    height: 100vh;
    max-width: var(--max-width);
    margin: var(--spacer-Elements) auto;
}

section {
    margin-bottom: var(--spacer-x5);
    text-align: center;
}
</style>