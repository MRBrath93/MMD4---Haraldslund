<script setup>
defineProps({
  icon: String,
  title: String,
  text: String,
});
</script>

<template>
    <div class="wrapper">
        <span class="material-symbols-rounded">{{ icon }}</span>
        <p class="bold">{{ title }}</p>
        <p>{{ text }}</p>
    </div>
</template>

<style scoped>
.wrapper{
    width: fit-content;
    padding: .5rem 1rem;
    background-color: var(--color-btn-primary);
    border-radius: var(--border-radius);
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.bold{
    font-weight: bold;
}
</style>