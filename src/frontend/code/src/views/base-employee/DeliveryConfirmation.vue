<script setup>
    import VueTable from '@/components/VueTable.vue'
    import { ref, onMounted } from 'vue';

    var data = {}
    var render = ref(0)
    const enable_select = true;
    const table = ref(null)
    var curr_page = 0;
    var selectedID = []

    function nextPage() {
        document.getElementById('prev').disabled = true
        document.getElementById('next').disabled = true
        selectedID[curr_page] = table.value.getParcels()
        curr_page = curr_page + 1
        fetch('http://localhost:8080/parcel/to-receiver/delivering?page=' + curr_page,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("jwt")
            },
        })
        .then((response) => response.json())
        .then((json) => {
            if (json['parcels'].length != 0) {
                data = json;
                render.value = render.value + 1
                document.getElementById('prev').disabled = false
                document.getElementById('next').disabled = false
            } else {
                alert('no more data!')
                curr_page -= 1
                if (curr_page != 0) {
                    document.getElementById('prev').disabled = false
                }
            }   
        });
    }

    function previousPage() {
        document.getElementById('prev').disabled = true
        document.getElementById('next').disabled = true
        selectedID[curr_page] = table.value.getParcels()
        curr_page = curr_page - 1
        fetch('http://localhost:8080/parcel/to-receiver/delivering?page=' + curr_page,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("jwt")
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


    function parcelsDelivered() {
        selectedID[curr_page] = table.value.getParcels()
        var finalList = []
        for (var row = 0; row < selectedID.length; row++) {
            for (var col = 0; col < selectedID[row].length; col++) {
                finalList.push(selectedID[row][col])
            }
        }

        fetch('http://localhost:8080/parcel/to-receiver/delivering', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(
                {
                    parcelIDs: finalList,
                    status: 3
                }
            )
        })
        .then(response => response.text())
        .then(response => alert(response))

        curr_page=0
        fetch('http://localhost:8080/parcel/to-receiver/delivering?page=0',{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("jwt")
            },
        })
        .then((response) => response.json())
        .then((json) => {
            data = json;
            render.value = render.value + 1
        });
    }

    function parcelsReturned() {
        selectedID[curr_page] = table.value.getParcels()
        var finalList = []
        for (var row = 0; row < selectedID.length; row++) {
            for (var col = 0; col < selectedID[row].length; col++) {
                finalList.push(selectedID[row][col])
            }
        }
        fetch('http://localhost:8080/parcel/to-receiver/delivering', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(
                {
                    parcelIDs: finalList,
                    status: 4
                }
            )
        })
        .then(response => response.text())
        .then(response => alert(response))

        curr_page=0
        fetch('http://localhost:8080/parcel/to-receiver/delivering?page=0',{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("jwt")
            },
        })
        .then((response) => response.json())
        .then((json) => {
            data = json;
            render.value = render.value + 1
        });
    }

    onMounted(()=>{
        fetch('http://localhost:8080/parcel/to-receiver/delivering?page=0',{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("jwt")
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
    <h1>DELIVERY IN PROGRESS</h1>
    
    <div id="nav">
        <button id="next" @click="nextPage()">NEXT PAGE</button>
        <button disabled id="prev" @click="previousPage()">PREV PAGE</button>
        <button @click="parcelsDelivered()">MARK PARCELS AS FINISHED</button>
        <button id="second" @click="parcelsReturned()">MARK PARCELS AS RETURNED</button>
    </div>
    <h2>Current page: {{ curr_page + 1 }}</h2>
    <vue-table :key="render.value" ref="table" :data="data['parcels']" :select="enable_select" :selected="selectedID"></vue-table>
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
        margin: 5px
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

    #second {
        margin-left: 10px;
    }
</style>