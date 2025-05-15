<script setup>
import ImageHolder from './ImageHolder.vue'
import TheBtn from './TheBtn.vue'
import { computed } from 'vue';

const props = defineProps({
  src: String,
  alt: {
    type: String,
    default: 'Ingen beskrivelse til billedet',
  },
  title: String,
  text: String,
  kategori: String,
  Btn_title: String,
  Btn_text: String,
  Btn_link: String,
  Btn_icon: String,
  Btn_target: String,
});

const computedBtnLink = computed(() => {
  switch (props.kategori) {
    case 'Motion':
      return '/motion';
    case 'Wellness':
      return '/wellness';
    case 'Svømmehal':
      return '/svommehal';
    case 'Møder & Konferencer':
      return '/moder-og-konferencer';
    case 'Om Haraldslund':
      return '/om-haraldslund';
    default:
      return props.Btn_link || '#';
  }
});

const computedTarget = computed(() => {
  return props.Btn_target ? props.Btn_target : '_self';
});


</script>


<template>
    <div class="ads_cart">
        <ImageHolder class="billede" :src="src" :alt="alt"></ImageHolder>
        <div class="text-wrapper">
          <div class="text-content">
            <div>
              <h4 class="title">{{ title }}</h4>
              <p>{{ text }}</p>
            </div>
              <TheBtn :link="computedBtnLink" :title="Btn_title" :target="computedTarget" :text="Btn_text" :icon="Btn_icon"></TheBtn>
          </div>
        </div>
    </div>
</template>
  
  <style scoped>

template{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.ads_cart {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color:  #e8dbcd;
  gap: 2rem;
  width: 95%;
  max-width: 1432px;
  padding: 0 2rem;
  margin: 50px auto;
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
  background-color:  #e8dbcd;
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
    margin: 50px auto;
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
  