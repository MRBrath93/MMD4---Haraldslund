<script setup>
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
</script>

<template>
    <button
    v-if="!link"

    class="button"
    
    @click="handleClick"
  >
  <!-- Plads til indhold via slot -->
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

  <a v-else :target="target" :href="link" class="button">
    <!-- Plads til indhold via slot -->
    <slot>
        <div class="flex">
            <div class="flex-column">
                <h4 class="title">{{ title }}</h4>
                <p class="small">{{ text }}</p>
            </div>
            <span v-if="icon" class="icon material-symbols-rounded">{{ icon }}</span>
        </div>
    </slot>
  </a>
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