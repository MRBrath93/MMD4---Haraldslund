<script setup>
import { ref } from "vue";
import { defineProps } from "vue";

defineProps({
  link: {
    type: String,
    required: true,
  },
  colors: {
    type: String,
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
    "Cardio",
    "Styrketræning",
    "Wellness",
    "Cirkeltræning",
    "Undervisning",
    "Mindfulness",
  ],
},
isOverlayVisible: {
  type: Boolean,
  default: false,
},
});

// Definer reaktive variabler
const isOverlayVisible = ref(false);


  // Metode til at håndtere hover-effekt
  const handleMouseEnter = () => {
    isOverlayVisible.value = true;
  };

  const handleMouseLeave = () => {
    isOverlayVisible.value = false;
  };

    

</script>
<template>
  <a 
    :href="link" 
    class="team-card team-card-image" 
    aria-label="Tryk for at gå til holdbeskrivelse"
    :style="{ backgroundImage: 'url(' + teamImage + ')' }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span class="icon material-symbols-rounded" :style="{ backgroundColor: backgroundColor }">{{ icon }}</span>

    <div class="team-card-overlay" :class="{ 'overlay-visible': isOverlayVisible }">
    <span class="icon material-symbols-rounded" :style="{ backgroundColor: backgroundColor }">{{ icon }}</span>
    <p class="overlay-text">{{ overlayText }}</p>
</div>
    <div :style="{ backgroundColor: backgroundColor }" class="card-label">
        <h3>{{ labels.label }}</h3>
        <p v-if ="teamCategorys.length > 0" class="card-tags">
            {{ teamCategorys[1] }}
        </p>
    </div>
    </a>


</template>

<style scoped>
.team-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  text-align: center;
  max-width: 27.5rem;
  max-height: 20.6rem;
  min-height: 12.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.team-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.team-card h3 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-font-2);
}

.icon {
  font-size: 2rem;
  padding: var(--spacer-x0-5);
  color: var(--color-font-2);
}

.overlay-text {
  font-size: 0.9rem;
  color: var(--color-font-2)
}

.card-label {
  font-size: 1.2rem;
  font-weight: bold;
  width: 100%;
  padding: var(--spacer-x0-5) var(--spacer-x2-5);
}

.card-tags {
    font-size: clamp(1rem, 2vw, 1.125rem);
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

@media screen and (min-width: 768px) {
  .team-card {
    width: 30rem;
    height: 25rem;
  }

  .overlay-visible .overlay-text {
    padding-top: var(--spacer-x5);
  }
    
}

</style>