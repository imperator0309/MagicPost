<script setup>
    import DropDown from '@/components/DropDown.vue';
    const links = {
        group_name: 'all links',
        child: [
            {name: 'company analytics', url: {name: 'national.parcel.stats'}},
            {name: 'base analytics', url: {name: 'local.parcel.stats'}},
            {name: 'create account', url: {name: 'add.acount'}},
            {name: 'create parcel', url: {name: 'create.parcel'}},
        ]
    }
</script>

<template>
    <div id="side_bar">
        <drop-down :data="links"></drop-down>
        <div id="side_bar_footer">
            <router-link :to="{name: 'home.default'}" class="img_container">
                <img src="/work_assets/logout.png">
            </router-link>
            <router-link :to="{name: 'home.default'}" class="img_container">
                <img src="/work_assets/home.png">
            </router-link>
            <router-link :to="{name: 'home.default'}" class="img_container">
                <img src="/work_assets/setting.png">
            </router-link>
        </div>
    </div>
    <div id="main">
        <router-view></router-view>
    </div>
</template>

<style scoped>
#side_bar {
    height: 100%;
    width: 200px;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #FF914D;
    overflow-x: hidden;
}

#main {
    margin-left: 200px;
    padding: 0px 10px;
}

#side_bar_footer {
    width: 100%;
    height: 10%;
    display: flex;
    position: absolute;
    bottom: 1%;
    left: 0;
}

.img_container {
    flex: 1;
}

#side_bar_footer img {
    width: 80%;
    object-fit: contain;
}
</style>