<script setup>
    import router from '@/router'
    // Switching between service views for <router-view>
    // Use this instead of <router-link> for css styling and increasing clicking area for users
    function switch_service(index) {
        if (index == 0) {
            router.push({name: 'parcel.info'});
        } else if (index == 1) {
            router.push({name: 'cost.estimate'});
        } else if (index == 2) {
            return;
        }
    }
</script>

<template>
    
    <div class="home_service_box">
        <ul>
            <li @click="switch_service(0)">
                ParcelTracer
            </li>
            <li @click="switch_service(1)">
                CostEstimator
            </li>
            <li class="active" @click="switch_service(2)">
                FindPostOffice
            </li>
        </ul>
        <div>
            <h1>NearbyPosts</h1>
        </div>
    </div>
</template>

<style scoped>
.home_service_box {
    padding-left: 5%;
    padding-right: 5%;
    padding-top: 1%;
    padding-bottom: 2%;
}
.home_service_box ul {
    display: flex;
    background-color: black;
    align-items: center;
}

.home_service_box li {
    flex: 1;
    list-style: none;
    padding: 13px;
    cursor: pointer;
    text-align: center;
    color: white;
}

.active {
    background-color: #FF914D;
}
.home_service_box div {
    background-color: #FF914D;
}

a {
    color: white;
    text-decoration: none;
}
</style>