<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// En liste af ikoner (Material Symbols rounded), som skal vises i midten af spinneren og skifte automatisk
const icons = ['pool', 'hot_tub', 'fitness_center', 'spa', 'sprint']

// En liste af farver til de roterende prikker omkring ikonet
const colors = [
  'var(--color-svim)',
  'var(--color-motion)',
  'var(--color-wellness)',
  'var(--color-meetings)'
]

// `currentIcon` holder det aktuelle ikon, som vises i midten af spinneren
const currentIcon = ref(icons[0])

// `iconIndex` holder styr på, hvilket ikon vi er nået til i rækken
let iconIndex = 0

// `intervalId` gemmer ID'et på setInterval-funktionen, så vi kan stoppe det igen ved behov
let intervalId

// Når komponenten er monteret i DOM'en, starter vi et interval, der skifter til næste ikon hver 3. sekund (3000 ms)
onMounted(() => {
  intervalId = setInterval(() => {
    // Gå til næste ikon, loop tilbage til start hvis vi er nået til slutningen
    iconIndex = (iconIndex + 1) % icons.length
    // Opdater reaktivt det viste ikon
    currentIcon.value = icons[iconIndex]
  }, 3000)
})

// Når komponenten fjernes fra DOM'en, rydder vi intervallet for at undgå fejl
onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>



<template>
  <div class="spinner-wrapper">
    <div class="spinner">
        <!-- I :style oprettes der variabler som holder farve og index(plads) -->
      <div v-for="(color, index) in colors" :key="index" class="dots" :style="{'--segment-color': color, '--i': index}"
      ></div>
      <span class="center-icon material-symbols-rounded">{{ currentIcon }}</span>
    </div>
    <p class="loading-text">Vi er ved at indlæse data...</p>
  </div>
</template>

<style scoped>
.spinner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  font-family: var(--font-heading);
  color: white;
}

.spinner {
  position: relative;
  width: 120px;
  height: 120px;
}

.center-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--spacer-x2-5);
  user-select: none;
  animation: pulse 2.5s infinite ease-in-out;
}

.dots {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--spacer-x1);
  height: var(--spacer-x1);
  background-color: var(--segment-color);
  border-radius: 50%;
  opacity: 0.9;
  transform-origin: 0 0;
  /* Placerer vores dots - Når --i = 0, bliver rotationen 0deg, Når --i = 1, bliver rotationen 90deg osv. */
  transform: rotate(calc(var(--i) * 90deg)) translateX(45px);
  animation: spin 2s linear infinite;

  box-shadow:
    0 0 6px 2px var(--segment-color),
    -5px 0 15px 6px var(--segment-color),
    -10px 0 25px 10px var(--segment-color),
    -15px 0 35px 14px var(--segment-color);
}

/* Selve rotationen */
@keyframes spin {
  0% {
    transform: rotate(calc(var(--i) * 90deg)) translateX(45px);
  }
  100% {
    transform: rotate(calc(var(--i) * 90deg + 360deg)) translateX(45px);
  }
}

/* Puls-anim for midterikon */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.loading-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-font-1);
}
</style>
