<script setup>
    import WebNavigationBar from '@/components/WebNavigationBar.vue';
    import HomeImageSlide from '@/components/HomeImageSlide.vue';
    import WebFooter from '@/components/WebFooter.vue';
</script>

<template>
    <web-navigation-bar></web-navigation-bar>
    <home-image-slide></home-image-slide>
    <router-view id="main_view"></router-view>
    <web-footer></web-footer>
</template>

<style scoped>
</style>