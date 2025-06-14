<script setup>
import { computed } from 'vue';
const props = defineProps({
  name: String,
  icon: String,
  title: String,
  color: String,
  bgimage: String,

});


const computedBtnLink = computed(() => {
  switch (props.name) {
    case 'Motion':
      return '/motion';
    case 'Wellness':
      return '/vand-og-wellness/wellness';
    case 'Svømmehal':
      return '/vand-og-wellness/svommehallen';
    case 'Møder & Konferencer':
      return '/moder-og-konferencer';
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
      return '/om-haraldslund/personale';
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
      return props.Btn_link || '#';
  }
});

const kategoriColor = computed(() => {
  switch (props.color) {
    case 'Om Haraldslund':
      return 'bg-haraldslund';
    case 'Møder & Konferencer':
      return 'bg-meeting';
    case 'Wellness':
      return 'bg-wellness';
    case 'Motion':
      return 'bg-motion';
    case 'Svømmehal':
      return 'bg-svommehal';
    default:
      return 'bg-default';
  }
});

</script>

<template>
    <router-link 
    :to="{ path: `${computedBtnLink}` }" 
    class="link-wrapper" 
    role="button" 
    :aria-label="`Tryk for at gå til ${title}`"
    >
      <div class="wrapper" :class="kategoriColor">
        <div class="bg-layer" :style="{ backgroundImage: `url(${bgimage})` }"></div>
        
        <div class="icon-wrapper">
          <i v-if="icon" :class="kategoriColor" class="icon material-symbols-rounded bounce-right" aria-hidden="true">{{ icon }}</i>
        </div>
        
        <div class="text-wrapper" :class="kategoriColor">
          <p>{{ title }}</p>
        </div>
  
        <div class="overlay">
          <p>Tryk for at læse mere</p>
        </div>
      </div>
    </router-link>
</template>

<style scoped>

.text-wrapper p {
  font-size: clamp(1.1rem, 2vw, 1.2rem);
  line-height: 1.4;
  font-family: var(--font-heading);
  font-weight: 600;
  text-align: center;
}

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

.icon-wrapper i {
  padding: 4px;
}

.text-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  color: var(--color-font-2);
  padding: var(--spacer-x0-5) 0;
  position: relative;
  z-index: 3;
}

.text-wrapper p {
  font-weight: 500;
  color: var(--color-font-2);
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


.link-wrapper:hover .overlay p{
  /* afspil animation i 0.9 sekunder, both betyder animationen bliver på slutstil */
  animation: bounce-from-top 0.9s both;
}

@keyframes bounce-from-top {
  0% {
    transform: translateY(-45px);
    animation-timing-function: ease-in;
  }
  40% {
    transform: translateY(-24px);
    animation-timing-function: ease-in;
  }
  65% {
    transform: translateY(-12px);
    animation-timing-function: ease-in;
  }
  82% {
    transform: translateY(-6px);
    animation-timing-function: ease-in;
  }
  93% {
    transform: translateY(-4px);
    animation-timing-function: ease-in;
  }
  100% {
    transform: translateY(0px);
    animation-timing-function: ease-out;
  }

  /* Procenter med samme egneskaber/stil  */
  25%,
  55%,
  75%,
  87% {
    transform: translateY(0px);
    animation-timing-function: ease-out;
  }
}

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

.bg-haraldslund {
  background-color: var(--color-haraldslund);
}

.bg-meeting {
  background-color: var(--color-meetings);
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
  background-color: #040404;
}

@media (prefers-reduced-motion: reduce) {
  .link-wrapper:hover .overlay{
    opacity: 0;
  }
  .link-wrapper:hover .bg-layer {
    filter: none;
  }
  .link-wrapper:hover .icon-wrapper {
    transform: none;
  }
  .link-wrapper:hover .text-wrapper {
    transform: none;
  }
  .link-wrapper:hover .wrapper {
    transform: none;
  }
  
}


@media screen and (max-width: 700px) {
   .overlay{
    display: none;
   }

   .link-wrapper:hover .bg-layer {
    filter: none;
}
    
}

</style>
