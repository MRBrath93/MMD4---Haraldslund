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
            <h5 class="hero-title">{{ title }}</h5>
            <h6 class="hero-subtitle"> {{ subtitle }}</h6>
        </div>
        <img :src="image" :alt="alt" id="hero-image" />
    </div>
</template>

<style scoped>
.hero {
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 50vh;
    width: 100%;
    margin-bottom: var(--spacer-x5);
}



.hero-title{
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 700;
    font-family: var( --font-heading);
    text-transform: uppercase;
    color: var(--color-font-2);
    text-shadow:
    -0.5px -0.5px 0 black,
    0.5px -0.5px 0 black,
    -0.5px  0.5px 0 black,
    0.5px  0.5px 0 black
}

.hero-subtitle{
    font-size: clamp(1.25rem, 5vw, 2.25rem);
    font-weight: 500;
    font-family: var(--font-heading);
}


/* Overlay */
.hero::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 198, 84, 0.2);
    z-index: 1;
}

.hero-text {
    position: relative;
    z-index: 2;
}

.hero-title, .hero-subtitle {
    color: var(--color-font-2);
    text-shadow:
    -0.5px -0.5px 0 black,
    0.5px -0.5px 0 black,
    -0.5px  0.5px 0 black,
    0.5px  0.5px 0 black
}

#hero-image {
    width: 100%;
    height: 50vh;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
}

@media screen and (min-width: 768px) {
    #hero-image {
        height: 32.5rem;
    }

    .hero {
        height: 32.5rem;
    }
}

</style>