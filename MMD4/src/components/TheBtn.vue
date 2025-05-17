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
  <a v-else-if="isExternalLink" :aria-label="text" :href="link" :target="target" class="button">
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
  <RouterLink v-else :to="link" :aria-label="text" class="button">
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