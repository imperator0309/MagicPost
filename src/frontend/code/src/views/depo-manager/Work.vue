<script setup>
    import DropDown from '@/components/DropDown.vue';
    import router from '@/router'

    const director_links = {
        group_name: 'depo manager panels',
        child: [
            {name: 'trans-account', url: {name: 'depomanager.trans.account'}},
            {name: 'trans-stats', url: {name: 'depomanager.trans.stats'}},
        ]
    }

    function logout() {
        fetch('http://localhost:8080/logout',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': document.cookie
            },
        })
        .then(response => {
            document.cookie = ''
            router.push({name: 'login'})
        })
    }

    function home() {
        router.push({name: 'depo.manager.default'})
    }
</script>

<template>
    <div id="side_bar">
        <drop-down :data="director_links"></drop-down>
        <div id="side_bar_footer">
            <div class="img_container" @click="logout">
                <img src="/work_assets/logout.png">
            </div>
            <div class="img_container"></div>
            <div class="img_container" @click="home">
                <img src="/work_assets/home.png">
            </div>
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