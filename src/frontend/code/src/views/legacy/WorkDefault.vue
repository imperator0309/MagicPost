<script setup>
    var cookies = sessionStorage.getItem("jwt")
</script>

<template>
    <h1>Hello, User {{ cookies }}.</h1>
    <h1>Role: {{ cookies['role'] }}</h1>
    <h1>Work At: {{ cookies['work_at'] }}</h1>
</template>

<style scoped>
</style>