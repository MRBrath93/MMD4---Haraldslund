<script setup>
import ImageHolder from '@/components/ImageHolder.vue';
import Image1 from '../assets/images/svomme.jpg';
</script>

<template>
        <div>
                <h2>Bibliotek</h2>
                <ImageHolder :src="Image1" alt="Mit billede"></ImageHolder>
        </div>
</template>

<style scoped>
</style>