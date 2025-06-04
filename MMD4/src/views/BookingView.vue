<script setup>
import TheBreadcrumb from '@/components/TheBreadcrumb.vue';
</script>

<template>
    <div>
        <TheBreadcrumb></TheBreadcrumb>
        <section>
            <h1>Booking</h1>
            <h2>En del af vores afgrænsning</h2>
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
    text-align: center;
}
</style>