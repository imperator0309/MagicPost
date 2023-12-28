<script setup>
    import router from '@/router'
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import ParcelInfoCard from '@/components/ParcelInfoCard.vue';
    const route = useRoute()
    var rerender = ref(0)
    var results = ref([])
    // Switching between service views for <router-view>
    // Use this instead of <router-link> for css styling and increasing clicking area for users
    function switch_service(index) {
        if (index == 0) {
            return;
        } else if (index == 1) {
            router.push({name: 'cost.estimate'});
        } else if (index == 2) {
            router.push({name: 'nearby.posts'});
        }
    }

    function search_parcels() {
        var ids = document.getElementById('parcels').value;
        while(results.length > 0) {
            results.pop();
        }
        rerender.value -= 1
        var parcels = ids.split(',')
        for (var i = 0; i < parcels.length; i++) {
            fetch('http://localhost:8080/search?id='+parcels[i])
            .then((response) => response.json())
            .then((json) => {
                results.value.push(json['parcel']);
                rerender.value += 1;
            });
        }
    }

    function search_parcels_enter(event) {
        if (event.key === "Enter") {
            event.preventDefault()
            search_parcels()
        }
    }

    onMounted(() => {
        var form = document.getElementById('tracking_form')
        form.addEventListener("keypress", search_parcels_enter, false)
        if (route.params.id === null || route.params.id === undefined || route.params.id === '') {
            results.value = [];
        } else {
            var parcels = route.params.id.split(',')
            for (var i = 0; i < parcels.length; i++) {
                fetch('http://localhost:8080/search?id='+parcels[i])
                .then((response) => response.json())
                .then((json) => {
                    results.value.push(json['parcel']);
                    rerender.value += 1;
                });
            }
        }
    })
</script>

<template>
    <div class="home_service_box">
        <ul class="home_service_header">
            <li class="active" @click="switch_service(0)">
                parcelTracer
            </li>
            <li @click="switch_service(1)">
                CostEstimator
            </li>
            <li @click="switch_service(2)">
                FindPostOffice
            </li>
        </ul>
        <div class="tracking_container">
            <form id = "tracking_form" onsubmit="">
                <label for="parcels">
                    <h1>TRACK YOUR PARCELS</h1>
                    <h3>Search multiple tracking numbers by separate with comma</h3>
                </label>
                <div class="search_box">
                    <input id="parcels" name="parcels" placeholder="ex:123456789,987654321">
                    <button id="submit" @click="search_parcels()"></button>
                </div>
            </form>
            <img id="tracking_icon" src="/home_assets/vroom.png">
        </div>
        <div v-if="results.length != 0" class="detail_container" :key="rerender">
            <h1>Parcel Info</h1>
            <ul id="card_list">
                <li v-for="parcel in results" class="card_container" :key="rerender">
                    <parcel-info-card :data="parcel"></parcel-info-card>
                </li>
            </ul>
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
.home_service_header {
    display: flex;
    background-color: black;
    align-items: center;
}

.home_service_header li {
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

a {
    color: white;
    text-decoration: none;
}

.tracking_container {
    background-color: #FF914D;
    padding-top: 5%;
    padding-left: 10%;
    padding-right: 10%;
    padding-bottom: 3%;
    display: flex;
}

#tracking_icon {
    flex: 1;
    width: 85%;
}

form {
    flex: 3;
}

.search_box {
    display: flex;
    height: 80px;
    align-items: center;
}

input {
    width: 50%;
    height: 35px;
    border-radius: 15px;
    flex: 3;
    text-indent: 10px;
}

#submit {
    flex: 1;
    border: none;
    background-color: #FF914D;
    background-image: url("/home_assets/magni_glass.png");
    height: 80px;
    background-size: 25%;
    background-repeat: no-repeat;
    background-position: left 15% center;
}

.detail_container {
    background-color: #FF914D;
    padding-left: 10%;
    padding-right: 10%;
    padding-bottom: 5%;
}
.card_container {
    width: 90%;
    margin: auto;
    color: black;
    background-color: lightgray;
    border: lightgray solid;
    list-style: none;
    margin-top: 10px;
    padding: 30px;
    box-sizing: border-box;
}
</style>