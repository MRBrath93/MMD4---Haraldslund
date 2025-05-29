<script setup>
// IMPORTS
import { ref, onMounted, onUnmounted, computed } from "vue";
import { defineProps } from "vue";

// IMPORTER STRAPI DATA
const props =  defineProps({
  link: {
    type: [String, Object],
    required: true,
  },
  overlayText: {
    type: String,
    default: "Tryk for at gå til holdbeskrivelse",
  },
  labels: {
    type: Object,
    required: true,
  },
  icon: {
    type: String,
    default: "arrow_forward",
  },
  backgroundColor: {
    type: String,
    required: true,
  },
  teamImage: {
    type: String,
    default: "@/assets/images/svomme.jpg",
  },
  teamImageAlt: {
    type: String,
    default: "Team Image",
},
teamCategorys: {
  type: Array,
  default: () => [
  ],
},
isOverlayVisible: {
  type: Boolean,
  default: false,
},
});

// REAKTIVE VARIABLER
const overlayVisible = ref(false);


// FUNKTIONER

  // Metode til at håndtere hover-effekt
  // Denne metode aktiverer overlayet, når brugeren holder musen over kortet, hvis
const handleMouseEnter = () => {
  if (!isReduced) {
    overlayVisible.value = true;
  }
};

  const handleMouseLeave = () => {
    overlayVisible.value = false;
  };

  const isScreenLarge = ref(false);

  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);

  onMounted(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
  });

  onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});

function checkScreenSize() {
  isScreenLarge.value = window.innerWidth >= 768;
}

// REDUCERET BEVÆGELSE
const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

const kategoriColor = computed(() => {
  switch (props.backgroundColor) {
    case 'Wellness':
      return 'bg-wellness';
    case 'Motion':
      return 'bg-motion';
    case 'Svømning':
      return 'bg-svommehal';
    default:
      return 'bg-default';
  }
});

</script>
<template>
  <router-link 
  :to="link" 
  class="team-card team-card-image" 
  :aria-label="'Tryk for at gå til holdbeskrivelse for ' + labels.label"
  :style="{ backgroundImage: 'url(' + teamImage + ')' }"
  @mouseenter="handleMouseEnter"
  @mouseleave="handleMouseLeave"
  role="button"
>
<!-- NOTE: :aria-label bliver brugt til at give en beskrivelse af linket for skærmlæsere. Labels.label bruges til at give en beskrivelse af holdet, så brugere med skærmlæsere kan forstå, hvad linket handler om. -->
    <i class="icon material-symbols-rounded" :class="kategoriColor" aria-hidden="true">{{ icon }}</i>
    <div class="team-card-overlay" :class="{ 'overlay-visible': overlayVisible }">
      <p class="overlay-text">{{ overlayText }}</p>
    </div>
    <div :class="kategoriColor" class="card-label">
      <p class="label">{{ labels.label }}</p>
      <p v-if="teamCategorys.length > 0" class="card-tags">
        <span v-for="(category, index) in teamCategorys" :key="index">
          {{ category }}
          <span v-if="index < teamCategorys.length - 1">, </span>
        </span>
      </p>
    </div>
  </router-link>

</template>

<style scoped>
.team-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  height: 100%;
  min-height: 14rem;
}

.team-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.team-card .label {
  margin: 0;
  color: var(--color-font-2);
}

.icon {
  font-size: 1.5rem;
  padding: var(--spacer-x0-5);
  color: var(--color-font-2);
  position: relative;
  z-index: 2;
}

.overlay-text {
  font-size: 0.9rem;
  color: var(--color-font-2)
}

.card-label {
  font-size: 1rem;
  font-weight: bold;
  width: 100%;
  padding: var(--spacer-x0-5) var(--spacer-x2-5);
  position: relative;
  z-index: 2;
}

.card-tags {
    font-size: 1rem;
    font-family: var(--font-text);
    color: var(--color-font-2);
    font-weight: 400;
}

.team-card-image {
  width: 100%;
  height: auto;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.team-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  background-color: rgba(0, 0, 0, 0.8);
  opacity: 0;
  width: 100%;
  z-index: 1;
}
.overlay-visible {
    opacity: 1;
    transition: opacity 0.3s ease;
}

.overlay-visible {
    overflow: hidden;
}

.overlay-visible .overlay-text {
    display: block;
    text-align: center;
    font-size: var(--font-text); 
    font-weight: 500;
    transition: opacity 0.3s ease;
    width: 100%;
}

.overlay-visible .icon {
  display: block;
}

.bg-motion {
  background-color: var(--color-motion);
}

.bg-svommehal {
  background-color: var(--color-svim);
}

.bg-wellness {
  background-color: var(--color-wellness);
}

.bg-default {
  background-color: #FFF;
}

@media screen and (min-width: 768px) {
  .team-card {
    min-height: 15.5rem;
  }
  
  .overlay-visible .overlay-text {
    padding-top: var(--spacer-x5);
  }
}

@media (prefers-reduced-motion: reduce) {
  .team-card:hover {
    transform: none;
    box-shadow: none;
  }

  .overlay-visible {
    transition: none;
  }

  .overlay-visible .overlay-text {
    transition: none;
  }

}

</style>

<!-- INSPIRATIONSKILDE, ROUTER LINK: Evan You, Eduardo San Martin Morote. Getting Started. Vue Router. 2014. (online) [Accessed 16/05/2025] URL: https://router.vuejs.org/guide/ -->