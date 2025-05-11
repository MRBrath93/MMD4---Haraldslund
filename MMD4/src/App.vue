<script setup>
import { RouterView } from "vue-router";
import TheNav from "./components/TheNav.vue";
import { watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

watch(() => route.meta.title, (title) => {
  if (title) document.title = title;
});
</script>

<template>
<body>
    <header>
        <TheNav></TheNav>
    </header>
    <main>
        <router-view></router-view>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis incidunt est non, id doloribus eius aliquid dolor consequatur quas temporibus corporis repellendus veniam voluptatum cum maiores suscipit dolores dignissimos labore quibusdam magnam necessitatibus ea. Labore, quasi enim. Voluptas sequi nostrum hic, reiciendis eum aspernatur in ipsam eius ipsum ratione ullam accusamus itaque, tenetur, at officia? Earum, ea neque praesentium nisi sequi dolore facere ipsum eaque laborum dicta eveniet voluptas animi quis nam illo vitae facilis, blanditiis amet quae sit minima repellendus eligendi. Dolores exercitationem eligendi temporibus ullam alias rem facere consequuntur odit beatae. Dolorem natus beatae soluta, mollitia nemo atque.</p>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis incidunt est non, id doloribus eius aliquid dolor consequatur quas temporibus corporis repellendus veniam voluptatum cum maiores suscipit dolores dignissimos labore quibusdam magnam necessitatibus ea. Labore, quasi enim. Voluptas sequi nostrum hic, reiciendis eum aspernatur in ipsam eius ipsum ratione ullam accusamus itaque, tenetur, at officia? Earum, ea neque praesentium nisi sequi dolore facere ipsum eaque laborum dicta eveniet voluptas animi quis nam illo vitae facilis, blanditiis amet quae sit minima repellendus eligendi. Dolores exercitationem eligendi temporibus ullam alias rem facere consequuntur odit beatae. Dolorem natus beatae soluta, mollitia nemo atque.</p>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis incidunt est non, id doloribus eius aliquid dolor consequatur quas temporibus corporis repellendus veniam voluptatum cum maiores suscipit dolores dignissimos labore quibusdam magnam necessitatibus ea. Labore, quasi enim. Voluptas sequi nostrum hic, reiciendis eum aspernatur in ipsam eius ipsum ratione ullam accusamus itaque, tenetur, at officia? Earum, ea neque praesentium nisi sequi dolore facere ipsum eaque laborum dicta eveniet voluptas animi quis nam illo vitae facilis, blanditiis amet quae sit minima repellendus eligendi. Dolores exercitationem eligendi temporibus ullam alias rem facere consequuntur odit beatae. Dolorem natus beatae soluta, mollitia nemo atque.</p>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis incidunt est non, id doloribus eius aliquid dolor consequatur quas temporibus corporis repellendus veniam voluptatum cum maiores suscipit dolores dignissimos labore quibusdam magnam necessitatibus ea. Labore, quasi enim. Voluptas sequi nostrum hic, reiciendis eum aspernatur in ipsam eius ipsum ratione ullam accusamus itaque, tenetur, at officia? Earum, ea neque praesentium nisi sequi dolore facere ipsum eaque laborum dicta eveniet voluptas animi quis nam illo vitae facilis, blanditiis amet quae sit minima repellendus eligendi. Dolores exercitationem eligendi temporibus ullam alias rem facere consequuntur odit beatae. Dolorem natus beatae soluta, mollitia nemo atque.</p>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis incidunt est non, id doloribus eius aliquid dolor consequatur quas temporibus corporis repellendus veniam voluptatum cum maiores suscipit dolores dignissimos labore quibusdam magnam necessitatibus ea. Labore, quasi enim. Voluptas sequi nostrum hic, reiciendis eum aspernatur in ipsam eius ipsum ratione ullam accusamus itaque, tenetur, at officia? Earum, ea neque praesentium nisi sequi dolore facere ipsum eaque laborum dicta eveniet voluptas animi quis nam illo vitae facilis, blanditiis amet quae sit minima repellendus eligendi. Dolores exercitationem eligendi temporibus ullam alias rem facere consequuntur odit beatae. Dolorem natus beatae soluta, mollitia nemo atque.</p>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis incidunt est non, id doloribus eius aliquid dolor consequatur quas temporibus corporis repellendus veniam voluptatum cum maiores suscipit dolores dignissimos labore quibusdam magnam necessitatibus ea. Labore, quasi enim. Voluptas sequi nostrum hic, reiciendis eum aspernatur in ipsam eius ipsum ratione ullam accusamus itaque, tenetur, at officia? Earum, ea neque praesentium nisi sequi dolore facere ipsum eaque laborum dicta eveniet voluptas animi quis nam illo vitae facilis, blanditiis amet quae sit minima repellendus eligendi. Dolores exercitationem eligendi temporibus ullam alias rem facere consequuntur odit beatae. Dolorem natus beatae soluta, mollitia nemo atque.</p>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis incidunt est non, id doloribus eius aliquid dolor consequatur quas temporibus corporis repellendus veniam voluptatum cum maiores suscipit dolores dignissimos labore quibusdam magnam necessitatibus ea. Labore, quasi enim. Voluptas sequi nostrum hic, reiciendis eum aspernatur in ipsam eius ipsum ratione ullam accusamus itaque, tenetur, at officia? Earum, ea neque praesentium nisi sequi dolore facere ipsum eaque laborum dicta eveniet voluptas animi quis nam illo vitae facilis, blanditiis amet quae sit minima repellendus eligendi. Dolores exercitationem eligendi temporibus ullam alias rem facere consequuntur odit beatae. Dolorem natus beatae soluta, mollitia nemo atque.</p>
    </main>
</body>
</template>

<style scoped>

</style>
