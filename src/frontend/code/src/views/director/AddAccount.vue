<template>
    <h2>Type account information here:</h2>
    <div class="addaccount">
        <form>
        <div>
            <label for="fname">Full name:</label>
            <input type="text" id="fname" name="fname">
        </div>
        <div>
            <label>Role: </label>
            <select id="role" name="role" @change="searchWorkplace()" @load="searchWorkplace()">
                <option value="basemanager" :disabled="isOptionDisabled('basemanager')">Base manager</option>
                <option value="transmanager" :disabled="isOptionDisabled('transmanager')">Trans manager</option>
                <option value="baseemployee" :disabled="isOptionDisabled('baseemployee')">Base employee</option>
                <option value="transemployee" :disabled="isOptionDisabled('transemployee')">Trans employee</option>
            </select>
        </div>
        <div>
            <label>Work at: </label>
            <select id="workplace" name="workplace"> 
            </select>
        </div>
        <div>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username">
        </div>
        <div>
            <label for="pass">Password:</label>
            <input type="text" id="pass" name="pass">
        </div>
        <div>
            <label for="repass">Re-password:</label>
            <input type="text" id="repass" name="repass">
        </div>
        <div class="submitbutton">
            <input class='formbutton' type="button" value="Submit" @click="checkValid()">
            <input class='formbutton' style="margin-left: auto;" type="reset" value="Reset">
        </div>
    </form>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
 
    const props = defineProps({
        disableBase: {
            type: Boolean,
            default: false,
        },
        disableTrans: {
            type: Boolean,
            default: false,
        },
    });

function isOptionDisabled(option) {
      if (option === 'basemanager') {
        return props.disableBase || props.disableTrans;
      } else if (option === 'transmanager') {
        return props.disableBase || props.disableTrans;
      } else if (option === 'baseemployee') {
        return props.disableTrans;
      } else if (option === 'transemployee') {
        return props.disableBase;
      }
      return false; 
    }
    
function searchWorkplace() {
    var base_url2 = "http://localhost:8080/base/view"
    var api_call_url2 = base_url2;
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var obj = JSON.parse(this.responseText);
          var len = obj['base'].length;
          if (len == 0) {
            alert("No workplaces available");
          } else {
              var workplaceName = document.getElementById("workplace");
              workplaceName.innerHTML = "";
              var selectedRole = getSelectedRole();
              var topLevelBases;
              if(selectedRole == 1 || selectedRole == 3) {
                topLevelBases = obj['base'].filter(bases => bases.baseType === 0);
                for(var base of topLevelBases) {
                    var baseOption = document.createElement("option");
                    baseOption.value = base.baseLocation;
                    baseOption.textContent = base.baseLocation;
                    baseOption.id = base._id;
                    workplaceName.appendChild(baseOption);
                }
              }
              else {
                var midLevelBases = [];
                midLevelBases = obj['base'].filter(bases => bases.baseType === 1);
                for(var base of midLevelBases) {
                    var baseOption = document.createElement("option");
                    baseOption.value = base.baseLocation;
                    baseOption.textContent = base.baseLocation;
                    baseOption.id = base._id;
                    workplaceName.appendChild(baseOption);
                }
              }
            }
        }
    }
    xmlhttp.open("GET", api_call_url2, true);
    xmlhttp.setRequestHeader("Accept", "application/json");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.setRequestHeader("Authorization", document.cookie);
    xmlhttp.send(null);
}

function postAccount() {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8080/account/create");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", document.cookie)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
    }};

    var name = document.getElementById("fname");
    var numberRole = getSelectedRole();
    const allWorkplaces = document.getElementById("workplace");
    const selectedWorkplace = allWorkplaces.options[allWorkplaces.selectedIndex].id;
    var userName = document.getElementById("username");
    var userPass = document.getElementById("pass");

    let data = {
      "username": userName.value,
      "password": userPass.value,
      "role": numberRole,
      "name": name.value,
      "workAt": selectedWorkplace
    };
    let accountData = {
        "accountData": data
    }
    let jsonData = JSON.stringify(accountData);
    xhr.send(jsonData);
}

function checkValid() {
    var userFullname = document.getElementById("fname").value;
    var userWorkplace = document.getElementById("workplace").value;
            if(userFullname == "" || userFullname.length < 2) {
                alert("Error! Your name is empty.");
                document.getElementById("fname").focus();
                return ;
            }
            var userWorkplace = document.getElementById("workplace").value;
            if(userWorkplace == "") {
                alert("Error! Your workplace is empty.");
                document.getElementById("fname").focus();
                return ;
            }
            var userName = document.getElementById("username").value;
            if(userName == "" || userName.length < 6 || userName.length > 30) {
                alert("Error! Your username is invalid.");
                document.getElementById("username").focus();
                return ;
            }

            var userPass = document.getElementById("pass").value, 
                userRepass = document.getElementById("repass").value;
            if(userPass.length < 6 || userPass.length > 14) {
                alert("Error! Your password is invalid.");
                document.getElementById("pass").focus();
                return ;
            }
            else if(userRepass.length < 6 || userRepass.length > 14) {
                alert("Error! Your password is invalid.");
                document.getElementById("repass").focus();
                return ;
            }
            else if(userPass != userRepass) {
                alert("Error! Your passwords are not the same.");
                document.getElementById("pass").focus();
                return ;
            }
            if(getSelectedRole() == "0") {
                alert("Error! You did not choose a role");
                document.getElementById("pass").focus();
                return ;
            }
            postAccount();
            alert("Account created successfully");
}

function getSelectedRole() {
    const dropdown = document.getElementById("role");
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    if (selectedOption) {
        const role = selectedOption.value;
        if (role === "basemanager") {
            return 1;
        } else if (role === "transmanager") {
            return 2;
        } else if (role === "baseemployee") {
            return 3;
        } else if (role === "transemployee") {
            return 4;
        }
    }

    return 0;
}
</script>

<style scoped>
    form {
        width: 480px;
        margin: auto;
        border: solid;
    }
    div {
        padding: 10px;
        display: flex;
    }
    label {
        text-align: left;
        flex-grow: 1;
    }
    h1 {
        text-align: center;
    }
    select, input {
        padding: 5px; 
        background:#edf2ff; 
        border: solid 2px black;
    }

    .formbutton {
      background-color:#2c3e50;
      color: white;
      padding: 10px;
      border-radius: 5px;
      border:none;
    }

    button {
      background-color:#2c3e50;
      color: white;
      padding: 10px;
      border-radius: 5px;
      border:none;
    }

    button:hover, 
    button:active {
        background-color: #fb8332;
        box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    }
    .formbutton:hover, 
    .formbutton:active {
        background-color: #fb8332;
        box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    }
</style>