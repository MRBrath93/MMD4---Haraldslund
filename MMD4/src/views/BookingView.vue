<script setup>
</script>

<template>
    <div>
        <TheBreadcrumb></TheBreadcrumb>  
        <TheInternNavMotion :labels="internNavLabels"></TheInternNavMotion>
        <section>
            <h1>Brugerråd</h1>
            <h2>... Maybe next time? </h2>
        </section>
    </div>
</template>

<style scoped>
div{
    height: 100vh;
    max-width: var(--max-width);
    margin: 0 auto;
}

section {
    padding-top: var(--spacer-x5);
    margin-bottom: var(--spacer-x5);
    text-align: center;
}
</style>