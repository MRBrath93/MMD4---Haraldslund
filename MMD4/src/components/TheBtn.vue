<script setup>
import { RouterLink } from "vue-router";
import { computed } from "vue";
const props = defineProps({
  onClick: Function,
  link: String,
  icon: String,
  title: String,
  text: String,
  target: String,
});

const computedBtnLink = computed(() => {
  switch (props.link) {
    case 'Motion':
      return '/motion';
    case 'Wellness':
      return '/vand-og-wellness/wellness';
    case 'Svømmehal':
      return '/vand-og-wellness/svommehallen';
    case 'Møder & Konferencer':
      return '/moder-og-konferencer';
    case 'Booking':
      return '/booking';
    case 'Om Haraldslund':
      return '/om-haraldslund';
    case 'Bibliotek':
      return '/om-haraldslund/bibliotek';
    case 'Brugerråd':
      return '/om-haraldslund/brugerraad';
    case 'Cafe':
      return '/om-haraldslund/cafe-harald';
    case 'Firmaaftaler':
      return '/om-haraldslund/firmaaftaler';
    case 'Historien':
      return '/om-haraldslund/vores-historie';
    case 'Personale':
      return '/om-haraldslund/personale';
    case 'Praktisk information':
      return '/om-haraldslund/praktisk-info';
    case 'Samlet priser':
      return '/om-haraldslund/priser';
    case 'Motion hold':
      return '/motion/holdoversigt';
    case 'Leje af sal og instruktør':
      return '/motion/leje-af-sal-og-instruktor';
    case 'Om motionscenteret':
      return '/motion/om-motioncenteret';
    case 'Personlig træning':
      return '/motion/personlig-traening';
    case 'Motion priser':
      return '/motion/priser';
    case 'Motion regler':
      return '/motion/regler';
    case 'Sundhed i bevægelse':
      return '/motion/sundhed-i-bevaegelse';
    case 'Vand og wellness':
      return '/vand-og-wellness';
    case 'VW hold':
      return '/vand-og-wellness/holdoversigt';
    case 'VW priser':
      return '/vand-og-wellness/priser';
    case 'VW regler':
      return '/vand-og-wellness/regler';
    default:
      return props.link || '#';
  }
});

const handleClick = () => {
  if (props.onClick) {
    // Kald den funktion, der er sendt som prop
    props.onClick(); 
  }
};

// Tjek om linket er eksternt (starter med http eller https)
const isExternalLink = computed(() => {
  return props.link?.startsWith("http");
});
</script>

<template>
   <!-- Knap uden link -->
  <button v-if="!link" :aria-label="text" class="button" @click="handleClick">
    <slot>
      <div class="flex">
        <div class="flex-column">
          <h4 class="title">{{ title }}</h4>
          <p class="small">{{ text }}</p>
        </div>
        <span v-if="icon" class="icon material-symbols-rounded">{{ icon }}</span>
      </div>
    </slot>
  </button>

  <!-- Eksternt link -->
  <a v-else-if="isExternalLink" :aria-label="text" :href="computedBtnLink" :target="target" class="button">
    <slot>
      <div class="flex">
        <div class="flex-column">
          <h5 class="title">{{ title }}</h5>
          <p class="small">{{ text }}</p>
        </div>
        <span v-if="icon" class="icon material-symbols-rounded">{{ icon }}</span>
      </div>
    </slot>
  </a>

  <!-- Internt link via RouterLink -->
  <RouterLink v-else :to="computedBtnLink" :aria-label="text" class="button">
    <slot>
      <div class="flex">
        <div class="flex-column">
          <h5 class="title">{{ title }}</h5>
          <p class="small">{{ text }}</p>
        </div>
        <span v-if="icon" class="icon material-symbols-rounded">{{ icon }}</span>
      </div>
    </slot>
  </RouterLink>
</template>

<style scoped>

button{
    text-align: start;
}

.icon{
    padding: var( --spacer-x0-25);
}

.flex{
    display: flex;
    gap: var(--spacer-x1);
    justify-content: space-between;
}

.flex-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
}


.theButton, .button {
  padding: var(--spacer-x0-5) var(--spacer-x1);
  width: fit-content;
  background-color: var(--color-btn-primary);
  border: none;
  text-decoration: none;
  border-radius: var( --border-radius);
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  display: block;
}


.theButton:hover, .button:hover {
  background-color: var(--color-btn-primary-hover);
  color: var(--color-font-2);
}

.theButton:hover p, .button:hover p{
  color: var(--color-font-2);
}

.theButton:active, .button:active {
  box-shadow: inset 0 -2px 7px rgba(0, 0, 0, 0.25), inset 0 4px 7px rgba(0, 0, 0, 0.25);
}
</style>