<script setup>
defineProps({
  src: String,
  alt: {
    type: String,
    default: 'Ingen beskrivelse til billedet',
  }
});
</script>


<template>
    <div class="images-container">
      <img :src="src" :alt="alt" class="image" />
      <div class="overlay-border"></div>
    </div>
</template>
  
  <style scoped>
  .images-container {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }
  
  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  
  .overlay-border {
    position: absolute;
    top: .5rem;
    left: .5rem;
    right: .5rem;
    bottom: .5rem;
    border: 1px solid white;
  }

  @media screen and (min-width: 800px) {
    .overlay-border {
      top: 1rem;
      left: 1rem;
      right: 1rem;
      bottom: 1rem;
    }
}

  </style>
  