<script setup>
    import HistoryTable from '@/components/HistoryTable.vue';
    import { ref, onMounted } from 'vue'
    
    var data = {}
    var render = ref(0)
    var curr_page = 0;

    function nextPage() {
        document.getElementById('prev').disabled = true
        document.getElementById('next').disabled = true
        curr_page = curr_page + 1
        fetch('http://localhost:8080/parcel/history/general?page=' + curr_page,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("jwt"),
                'Cache-control': 'no-cache'
            },
        })
        .then((response) => response.json())
        .then((json) => {
            if (json['history'] != '') {
                data = json;
                render.value = render.value + 1
                document.getElementById('prev').disabled = false
                document.getElementById('next').disabled = false
            } else {
                document.getElementById('prev').disabled = false
                alert('no more data!')
                curr_page -= 1
            }            
        });
    }

    function previousPage() {
        document.getElementById('prev').disabled = true
        document.getElementById('next').disabled = true
        curr_page = curr_page - 1
        fetch('http://localhost:8080/parcel/history/general?page=' + curr_page,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("jwt"),
                'Cache-control': 'no-cache'
            },
        })
        .then((response) => response.json())
        .then((json) => {
            data = json;
            render.value = render.value + 1
            if (curr_page != 0) {
                document.getElementById('prev').disabled = false
            }
            document.getElementById('next').disabled = false
        });
    }


    onMounted(()=>{
        fetch('http://localhost:8080/parcel/history/general?page=' + curr_page,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("jwt"),
                'Cache-control': 'no-cache'
            },
        })
        .then((response) => response.json())
        .then((json) => {
            data = json;
            render.value = render.value + 1
        });
    })
</script>

<template>
    <h1>DELIVERY HISTORY</h1>
    <div id="nav">
        <h2>Current page: {{ curr_page + 1 }}</h2>
        <button id="next" @click="nextPage()">NEXT PAGE</button>
        <button disabled id="prev" @click="previousPage()">PREV PAGE</button>
    </div>
    <history-table :key="render.value" :data="data['history']"></history-table>
</template>

<style scoped>
    button {
        padding: 5px;
    }
    
    #nav {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    #next, #prev {
        float: right;
        margin: 5px;
    }

    h1 {
        padding-top: 5px;
        text-align: center;
        font-weight: bold;
    }

    h2 {
        text-align: right;
        padding-bottom: 5px;
        padding-right: 10px;
        font-size: medium;
    }
</style>