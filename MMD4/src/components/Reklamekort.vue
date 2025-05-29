<script setup>
import ImageHolder from './ImageHolder.vue'
import TheBtn from './TheBtn.vue'
import { computed } from 'vue';

const props = defineProps({
  src: {
    type: String,
    default: 'https://via.placeholder.com/600x400?text=Test+Billede',
  },
  alt: {
    type: String,
    default: 'Ingen beskrivelse til billedet',
  },
  title: {
    type: String,
    default: 'Test Overskrift',
  },
  text: {
    type: String,
    default: 'Dette er en test tekst, som vises, hvis ingen anden tekst er givet.',
  },
  kategori: {
    type: String,
    default: 'Default',
  },
  Btn_title: {
    type: String,
    default: 'Læs mere',
  },
  Btn_text: {
    type: String,
    default: 'Læs mere om dette emne',
  },
  Btn_link: {
    type: String,
    default: '#',
  },
  Btn_icon: {
    type: String,
    default: 'arrow_right',
  },
  Btn_target: {
    type: String,
    default: '_self',
  },
});


const computedBtnLink = computed(() => {
  switch (props.kategori) {
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
      return props.Btn_link || '#';
  }
});



const computedTarget = computed(() => {
  return props.Btn_target ? props.Btn_target : '_self';
});

const kategoriColor = computed(() => {
  switch (props.kategori) {
    case 'Om Haraldslund':
    case 'Historien':
    case 'Praktisk information':
    case 'Cafe':
    case 'Bibliotek':
    case 'Brugerråd':
    case 'Booking':
    case 'Personale':
    case 'Cafe':
    case 'Firmaaftaler':
    case 'Samlet priser':
      return 'bg-haraldslund';
    case 'Møder & Konferencer':
    case 'Events':
      return 'bg-meeting';
    case 'Wellness':
      return 'bg-wellness';
    case 'Motion hold':
    case 'Motion':
    case 'Leje af sal og instruktør':
    case 'Om motionscenteret':
    case 'Personlig træning':
    case 'Motion priser':
    case 'Motion regler':
    case 'Sundhed i bevægelse':
      return 'bg-motion';
    case 'Svømmehal':
    case 'Vand og wellness':
    case 'VW hold':
    case 'VW priser':
    case 'VW regler':
      return 'bg-svommehal';
    default:
      return 'bg-default';
  }
});
</script>

<template>
    <article 
    class="ads_cart" 
    :class="kategoriColor" 
    aria-label="Reklame for Haraldslund"
    :aria-label="`Reklame for ${title}`"
    tabindex="0"
    >
        <ImageHolder 
        class="billede" 
        :src="src" 
        :alt="alt"
        role="img"
        ></ImageHolder>
        <div class="text-wrapper">
          <div class="text-content">
            <div>
              <h4 class="title">{{ title }}</h4>
              <p>{{ text }}</p>
            </div>
              <TheBtn 
              :link="computedBtnLink" 
              :title="Btn_title" 
              :target="computedTarget" 
              :text="Btn_text" 
              :icon="Btn_icon"></TheBtn>
          </div>
        </div>
      </article>
</template>
  
  <style scoped>

.ads_cart {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color:  #e8dbcd;
  gap: 2rem;
  width: 95%;
  max-width: var(--max-width);
  padding: 0 2rem;
  margin: var(--spacer-Elements) auto;
}

.ads_cart p, .ads_cart h4{
  color: var(--color-font-1);
}

.billede{
  position: absolute;
  max-width: 45%;
  height: 115%;
  margin-left: 2rem;
  left: 0;
}

.text-wrapper {
  padding: 2rem;
  height: 100%;
  background-color:  transparent;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  align-items: center;
  min-height: 300px;
}

.text-content{
  grid-column: 2/3;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bg-haraldslund {
  background-color: var(--color-haraldslund-light);
}

.bg-meeting {
  background-color: var(--color-meetings-light);
}

.bg-motion {
  background-color: var(--color-motion-light);
}

.bg-svommehal {
  background-color: var(--color-svim-light);
}

.bg-wellness {
  background-color: var(--color-wellness-light);
}

.bg-default {
  background-color: #ffffff;
}


@media screen and (min-width: 1300px) {

.ads_cart {
    min-height: 350px;
}
}

@media screen and (max-width: 1000px) {

.ads_cart {
    padding: 0 1rem;
}

.billede {
    margin-left: 1rem;
}
}

@media screen and (max-width: 700px) {

  .ads_cart{
    padding: 0rem;
    margin: var(--spacer-Elements) auto;
    width: 95%;
  }

.text-wrapper {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, 1fr);
    padding: 1rem;
}

.text-content{
  grid-column: unset;
  grid-row: 2/3;
}

.billede{
  position: absolute;
  max-width: 100%;
  height: 50%;
  margin-left: 0rem;
  top: 0px;
}

}
  </style>
  