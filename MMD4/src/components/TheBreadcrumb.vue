<script setup>
</script>

<template>
  <section label="breadcrumb" class="breadcrumb-container">
    <ul class="breadcrumb">
        <li
            v-for="(crumb, index) in $breadcrumbs.value"
            :key="index"
            class="breadcrumb-item"
            :class="{ active: crumb.current }"
        >
            <router-link 
            v-if="!crumb.current" 
            :to="crumb.link">
            {{ crumb.label }}
            </router-link>
            <span v-else>{{ crumb.label }}</span>
        </li>
    </ul>
  </section>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  list-style: none;
  flex-wrap: wrap;
  padding: var(--spacer-x1) 0;
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  color: var(--color-font-1);
}

.breadcrumb-item {
  min-height: 1.5rem;
  min-width: 1.5rem;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: " / ";
  padding: 0 0.5rem;

}

.breadcrumb-item.active {
  font-weight: bold;
}

li, span, a {
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  font-family: var(--font-text);
}


</style>

<!-- KILDE: Merkushin-AY. Vue-3-breadcrumbs (online) NPM [Accessed 12/05/25] URL:https://www.npmjs.com/package/vue-3-breadcrumbs -->
