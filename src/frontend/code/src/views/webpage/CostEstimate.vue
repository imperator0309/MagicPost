<script setup>
    import router from '@/router'
    // Switching between service views for <router-view>
    // Use this instead of <router-link> for css styling and increasing clicking area for users
    function switch_service(index) {
        if (index == 0) {
            router.push({name: 'parcel.info'});
        } else if (index == 1) {
            return;
        } else if (index == 2) {
            router.push({name: 'nearby.posts'});
        }
    }
</script>

<template>
    <div class="home_service_box">
        <ul>
            <li @click="switch_service(0)">
                ParcelTracer
            </li>
            <li class="active" @click="switch_service(1)">
                CostEstimator
            </li>
            <li @click="switch_service(2)">
                FindPostOffice
            </li>
        </ul>
        <div class="container">
            <form onsubmit="return false;">
                <h1>COST ESTIMATION</h1>
                <div class="form_group">
                    <label for="src_city">From City</label>
                    <input id="src_city" name="src_city">
                </div>
                <div class="form_group">
                    <label for="src_district">From District</label>
                    <input id="src_district" name="src_district">
                </div>
                <div class="form_group">
                    <label for="des_city">To City</label>
                    <input id="des_city" name="des_city">
                </div>
                <div class="form_group">
                    <label for="des_district">To District</label>
                    <input id="des_district" name="des_district">
                </div>
                <div class="form_group">
                    <label for="weight">Weight</label>
                    <input id="weight" name="weight">
                </div>
                    <button type="submit" class="btn1">Estimate</button>
            </form>
        <div class="output">
            <h1>SERVICE NAME</h1>
            <h2>Shipping</h2>
            <br>
            <h1>Est. cost</h1>
            <h2>A lot</h2>
            <br>
            <h1>Est. time</h1>
            <h2>God knows</h2>
        </div>
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

input {
    width: 50%;
    height: 35px;
    border-radius: 15px;
    flex: 3;
    text-indent: 10px;
}
.container {
    padding: 5%;
    padding-left: 10%;
    padding-right: 10%;
    display: flex;
}
.form_group {
    display: flex;
    align-items: center;
    padding-top: 10px;
    padding-bottom: 10px;
}

label {
    flex: 1;
    font-weight: bold;
}

form {
    flex: 2;
}

.output {
    flex: 1;
    text-align: right; 
    margin: auto;
    width: 50%;
}

.btn1 {
    float: right;
    width: 50%;
    height: 35px;
    border-radius: 15px;
    background-color: black;
    color: #FF914D;
    cursor: pointer;
}

@media screen and (min-width: 300px) and (max-width: 600px) {
    .container {
        display: block;
    }
    .form_group {
        padding-top: 5px;
        padding-bottom: 5px;
    }
    input {
        height: 30px;
    }
    .btn1 {
        width: 100%;
    }
    .output {
        padding-top: 50px;
        text-align: center;
    }

    h1 {
        font-size: large;
    }

    h2 {
        font-size: medium;
    }

    label {
        font-size: medium;
    }
}
</style>