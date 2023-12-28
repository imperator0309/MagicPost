<script setup>
    import WebNavigationBar from '@/components/WebNavigationBar.vue';
    import HomeImageSlide from '@/components/HomeImageSlide.vue';
</script>

<template>
    <web-navigation-bar></web-navigation-bar>
    <home-image-slide></home-image-slide>
    <router-view id="main_view"></router-view>
    <img src="/home_assets/footer.png">
</template>

<style scoped>
    img {
        width: 100%;
    }
</style>