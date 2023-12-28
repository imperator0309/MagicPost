<script setup>
    import { toRef } from 'vue';

    const props = defineProps({
        data: Object
    })
    const group_name = toRef(props).value.data['group_name'];
    var display = false;
    function toggle() {
        var content = document.getElementById(group_name);
        if (!display) {
            content.style.display = 'block';
            display = true;
        } else {
            content.style.display = 'none';
            display = false;
        }
    }
</script>

<template>
    <div class="dropdown">
        <button @click="toggle()">
            {{ data['group_name'] }}
        </button>
        <div :id="data['group_name']" class="dropdown_content">
            <router-link v-for="link in data['child']" :to="link['url']">{{ link['name'] }}</router-link>
        </div>
    </div>
</template>

<style scoped>
button {
  width: 100%;
  background-color: #FF914D;
  color: white;
  padding-top: 0%;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.dropdown {
  position: relative;
  display: inline-block;
  width: 100%;
}

.dropdown_content {
  display: none;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown_content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown_content a:hover .router-link-active {background-color: #f1f1f1}

.dropdown:hover .dropbtn {
  background-color: #3e8e41;
}
</style>