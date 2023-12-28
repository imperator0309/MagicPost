<script setup>
    import router from '@/router'
    import { ref } from 'vue';
    import WebNavigationBar from '@/components/WebNavigationBar.vue';
    var visible_pass = ref(false);
    
    function view_password() {
        //do not change image url.
        if (visible_pass) {
            visible_pass = false;
            document.getElementsByClassName('eye_icon')[0].src = "/login_assets/hidden1.png";
            document.getElementById('psword').type = "password";
        } else {
            visible_pass = true;
            document.getElementsByClassName('eye_icon')[0].src = "/login_assets/not_hidden1.png";
            document.getElementById('psword').type = "";
        }
    };

    function login() {
        var uid = document.getElementById('uid').value
        var psword = document.getElementById('psword').value

        fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    username: uid,
                    password: psword
                }
            )
        })
        .then(function(response) {
            if (!response.ok) {
                alert("Invalid credentials")
                throw new Error("Invalid credentials");
            }
            return response.json()
        })
        .then(response => {
            sessionStorage.clear()
            sessionStorage.setItem("jwt", response['jwt'])
            fetch('http://localhost:8080/my/', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("jwt")
                },
            })
            .then(details => details.json())
            .then(response => {
                if (response['role'] == 0) {
                    router.push({name: 'director'})
                } else if (response['role'] == 1) {
                    router.push({name: 'base.manager'})
                } else if (response['role'] == 2) {
                    router.push({name: 'depo.manager'})
                } else if (response['role'] == 3) {
                    router.push({name: 'depo.employee.default'})
                } else if (response['role'] == 4) {
                    router.push({name: 'base.employee.default'})
                } else {
                    alert("Invalid credentials")
                    throw new Error("Invalid credentials");
                }
            })
        })
    }
</script>

<template>
    <web-navigation-bar></web-navigation-bar>
    <div class="login">
        <img class="bg_img" src = '/home_assets/slim_slide0.png'>
        <form onsubmit="return false">
            <h1>Login</h1>
            <h2>Employees only!</h2>
            <div class="form_group">
                <div class="user_input">
                    <img class="input_icon" src = "/login_assets/user1.png">
                    <input id="uid" name="uid" placeholder="UserID">
                    <div class="warning"></div>
                </div>
            </div>
            <div class="form_group">
                <div class="user_input">
                    <img class="input_icon" src = '/login_assets/password1.png'>
                    <input type="password" id="psword" name="psword" placeholder="Password">
                    <img class="eye_icon" src="/login_assets/hidden1.png" @click="view_password()">
                    <div class="warning"></div>
                </div>
            </div>
            <div class="form_group">
                <input type="submit" value="Login" @click="login()">
            </div>
        </form>
    </div>
</template>

<style scoped>
    .login {
        position: relative;
    }
    .bg_img {
        width: 100%;
    }

    form {
        position: absolute;
        width: 35%;
        top: 5%;
        right: 5%;
        padding: 5%;
        border: 10px;
        border-radius: 50px;
        background-color: white;
    }

    h1, h2 {
        text-align: center;
    }

    .form_group {
        padding: 10px;
        padding-top: 30px;
    }

    .user_input {
        position: relative;
    }

    label {
        font-size: x-large;
    }

    input {
        width: 100%;
        height: 50px;
        border-radius: 15px;
        text-indent: 35px;
    }
    .eye_icon {
        width: 24px;
        height: 24px;
        position: absolute;
        right: 1%;
        top: 30%;
        cursor: pointer;
    }

    .input_icon {
        width: 24px;
        height: 24px;
        position: absolute;
        left: 3%;
        top: 30%;
    }

    @media screen and (min-width: 300px) and (max-width: 600px) {
        form {
            width: 100%;
            padding: 0%;
            top: 0;
            left: 0;
            border-radius: 0px;
        }

        .bg_img {
            display: none;
        }
    }
</style>