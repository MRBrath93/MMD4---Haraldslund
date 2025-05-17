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
    <div class="image-container">
      <img :src="src" :alt="alt" class="image" />
      <div class="overlay-border"></div>
    </div>
</template>
  
  <style scoped>
  .image-container {
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
    top: .6rem;
    left: .6rem;
    right: .6rem;
    bottom: .6rem;
    border: 1px solid white;
  }

  .image-container {
  min-height: 100%;
}

  </style>
  