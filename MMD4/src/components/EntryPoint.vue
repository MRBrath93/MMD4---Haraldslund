<script setup>
const props = defineProps({
  name: String,
  icon: String,
  title: String,
  color: String,
  bgimage: String,

});

</script>

<template>
    <router-link :to="{ name: `${name}` }" class="link-wrapper">
      <div class="wrapper">
        <div class="bg-layer" :style="{ backgroundImage: `url(${bgimage})` }"></div>
        
        <div class="icon-wrapper">
          <span v-if="icon" :class="color" class="icon material-symbols-rounded">{{ icon }}</span>
        </div>
        
        <div class="text-wrapper" :class="color">{{ title }}</div>
  
        <div class="overlay">
          <p>Tryk for at læse mere</p>
        </div>
      </div>
    </router-link>
</template>

<style scoped>
.wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  min-width: fit-content;
  height: 100%;
  overflow: hidden;
}

.bg-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  filter: none;
  transition: filter 0.3s ease;
  z-index: 0;
}

.link-wrapper:hover .bg-layer {
  filter: blur(2px);
}

.icon-wrapper {
  display: flex;
  justify-content: end;
  width: 100%;
  color: var(--color-font-2);
  position: relative;
  z-index: 3;
}

.icon-wrapper span {
  padding: 9px;
}

.text-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  color: var(--color-font-2);
  font-size: 1.5rem;
  padding: var(--spacer-x0-5) 0;
  position: relative;
  z-index: 1;
}

.link-wrapper {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  font-size: 1.5rem;
}

.overlay p {
  color: var(--color-font-2);
}

.link-wrapper:hover .overlay {
  opacity: 1;
}

/* Farve-klasser */
.green {
  background-color: var(--color-motion);
}

.blue {
  background-color: var(--color-svim);
}

.purple {
  background-color: var(--color-wellness);
}

.brown {
  background-color: var(--color-meetings);
}

</style>
