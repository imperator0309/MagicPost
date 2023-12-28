<script setup>
    import DropDown from '@/components/DropDown.vue';
    import router from '@/router';
    const parcel_links = {
        group_name: 'parcel operations',
        child: [
            {name: 'pending to base', url: {name: 'depo.employee.pending.to.base'}},
            {name: 'pending from base', url: {name: 'depo.employee.pending.from.base'}},
            {name: 'pending to depo', url: {name: 'depo.employee.pending.to.depo'}},
            {name: 'pending from depo', url: {name: 'depo.employee.pending.from.depo'}},
        ]
    }
    const history_links = {
        group_name: 'view history',
        child: [
            {name: 'delivery history', url: {name: 'depo.employee.delivery.history'}}
        ]
    }

    function logout() {
        fetch('http://localhost:8080/logout',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("jwt")
            },
        })
        .then(response => {
            sessionStorage.clear()
            router.push({name: 'login'})
        })
    }

    function home() {
        router.push({name: 'depo.employee'})
    }
</script>

<template>
    <div id="side_bar">
        <drop-down :data="parcel_links"></drop-down>
        <drop-down :data="history_links"></drop-down>
        <div id="side_bar_footer">
            <div id="side_bar_footer">
                <div class="img_container" @click="logout">
                    <img src="/work_assets/logout.png">
                </div>
                <div class="img_container"></div>
                <div class="img_container">
                    <img src="/work_assets/home.png" @click="home">
                </div>
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