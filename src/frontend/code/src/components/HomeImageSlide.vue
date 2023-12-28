<script setup>
    import { onMounted, onUnmounted, ref} from 'vue';
    var current_image = ref(0);
    var timer;
    /* Function switching image for image slide manually */
    function set_image(index) {
        if (index >= 3) {
            index = 0
        }
        current_image.value = index;
        let dots = document.getElementsByClassName("home_dot");
        for (var i = 0; i < dots.length; i++) {
            dots[i].className = "home_dot"
        }
        dots[index].className += " home_dot_active"
    }

    /* Function for interval rotating image automatically */
    function auto_increment() {
        if (current_image.value == 2) {
            current_image.value = 0;
        } else {
            current_image.value += 1;
        }
        let dots = document.getElementsByClassName("home_dot");
        for (var i = 0; i < dots.length; i++) {
            dots[i].className = "home_dot"
        }
        dots[current_image.value].className += " home_dot_active";
    }

    onMounted(() => {
        current_image.value = 0;
        timer = setInterval(auto_increment, 5000);
    })

    onUnmounted(() => {
        clearInterval(timer);
    })
</script>

<template>
    <div class="home_image_slide">
        <div v-show="current_image == 0" class="home_image_container">
            <img class="home_image" src="/home_assets/slim_slide0.png">
        </div>
        <div v-show="current_image == 1" class="home_image_container">
            <img class="home_image" src="/home_assets/slim_slide1.png">
        </div>
        <div v-show="current_image == 2" class="home_image_container">
            <img class="home_image" src="/home_assets/slim_slide2.png">
        </div>
        <div class="home_dot_area">
            <span class="home_dot home_dot_active" @click="set_image(0)"></span>
            <span class="home_dot" @click="set_image(1)"></span>
            <span class="home_dot" @click="set_image(2)"></span>
        </div>
    </div>
</template>

<style scoped>
/* Image Slide CSS */
.home_dot_area {
    text-align: center;
    position: relative;
}

.home_dot {
    position: relative;
    cursor: pointer;
    height: 15px;
    width: 15px;
    margin: 0 5px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
    transition: background-color 0.6s ease;
    bottom: 40px;
}

.home_image {
    width: 100%;
}

.home_image_container {
    width: 100%;
}

.home_dot_active, .home_dot:hover {
    background-color: #FF914D;
}

</style>