<script setup>
import ImageHolder from './ImageHolder.vue'

defineProps({
  src: String,
  alt: {
    type: String,
    default: 'Ingen beskrivelse til billedet',
  },
  title: String,
  text: String,
  Btn:{
    Btn_title: String,
    Btn_text: String,
    Btn_link: String,
    Btn_icon: String,
    Btn_target: String,
  }
});


</script>


<template>
    <div class="ads_cart">
        <ImageHolder :src="src" :alt="alt"></ImageHolder>
        <div class="text-wrapper">
            <h4 class="title">{{ title }}</h4>
            <p class="small">{{ text }}</p>
            <TheBtn :link="Btn.btn_link" :title="Btn.Btn_title" :text="Btn.Btn_text" :icon="Btn.Btn_icon"></TheBtn>
        </div>
    </div>
</template>
  
  <style scoped>
.ads_cart{
    background-color: burlywood;

}
  </style>
  