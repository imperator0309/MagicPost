<script setup>

</script>

<template>
    <div class="web_navigation_bar">
        <ul class="web_nav_list">
            <li class="logo">
                <router-link :to= "{name:'home.default'}">
                    <img src="/home_assets/logo1.png">
                </router-link>
            </li>
            <li class="url">
                
            </li>
            <li class="url">
                
            </li>
            <li class="url">
                <router-link :to= "{name:'login'}">Login</router-link>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.web_navigation_bar {
    background-color: black;
    color: white;
    font-weight: bold;
    font-size: larger;
    width: 100%;
    height: 80px;
    display: flex;
    position: sticky;
    top: 0;
    z-index: 1;
}

.web_navigation_bar ul {
    width: 100%;
    display: flex;
}

.web_navigation_bar li {
    flex: 2;
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.logo {
    flex: 1;
}

.url {
    flex: 2;
}

.router-link-active, a:hover{
    color: #FF914D;
}

a {
    color: white;
    text-decoration: none;
    text-align: center;
    margin: auto;
}

img {
    height: 80px;
    object-fit: contain;
}
</style>