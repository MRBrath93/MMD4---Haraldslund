<script setup>
defineProps({
    title: String,
    subtitle: String,
    image: String,
    alt: String
});


</script>

<template>
    <div class="hero">
        <div class="hero-text">
            <h1 class="hero-title">{{ title }}</h1>
            <p class="hero-subtitle"> {{ subtitle }}</p>
        </div>
        <img :src="image" :alt="alt" id="hero-image" />
    </div>
</template>

<style scoped>
.hero {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 7.6rem;
    /* max-height: 21.8rem; 
    min-height: 7.6rem;  */
    position: relative;
    overflow: hidden;
    background-color: rgb(20, 20, 20, 0.5);
    margin-bottom: var(--spacer-Elements);
}

.hero-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.hero-title {
    font-size: clamp(3rem, 5vw, 5.33rem);
    font-weight: 700;
    text-transform: uppercase;
    color: var(--color-font-2);
    text-shadow:
    -0.5px -0.5px 0 black,
    0.5px -0.5px 0 black,
    -0.5px  0.5px 0 black,
    0.5px  0.5px 0 black
}

.hero-subtitle {
    font-size: clamp(1.5rem, 2vw, 3rem);
    font-weight: regular;
    color: var(--color-font-2);
    text-shadow:
    -0.5px -0.5px 0 black,
    0.5px -0.5px 0 black,
    -0.5px  0.5px 0 black,
    0.5px  0.5px 0 black
}

#hero-image {
    width: 100%;
    height: 7.6rem;
    object-fit: cover;
}

@media screen and (min-width: 768px) {
    .hero {
        height: 21.8rem;
    }
    #hero-image {
        height: 21.8rem;
    }
}
</style>