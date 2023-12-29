<script setup>
import { toRef, onUpdated } from 'vue';

    const props = defineProps({
        data: Array,
        selected: Array,
        select: Boolean
    })

    function getTickedAccounts() {
        var checkBoxes = document.getElementsByClassName('select_row');
        var selectedID = [];
        for (var i = 0; i < checkBoxes.length; i++) {
            if (checkBoxes[i].checked) {
                selectedID.push(checkBoxes[i].id);
            }
        }
        return selectedID;
    }

    function reset() {
        var checkBoxes = document.getElementsByClassName('select_row')
        for (var i = 0; i < checkBoxes.length; i++) {
            checkBoxes[i].checked = false
        }
        var selected = toRef(props).value.selected
        for (var row = 0; row < selected.length; row++) {
            for (var i = 0; i < selected[row].length; i++) {
                var box = checkBoxes[selected[row][i]]
                if (box != null) {
                    console.log(box.id)
                    box.checked = true
                }
            }
        }
    }

    function toggleDetails(parcel_id) {
        var button = document.getElementById(parcel_id+'details');
        var panel = document.getElementById(parcel_id+'panel');
        if (button.textContent == 'DETAILS') {
            panel.style = ''
            button.textContent = 'HIDE'
        } else {
            panel.style.display = 'none'
            button.textContent = 'DETAILS'
        }
    }

    function toggleEdit(acc_id) {
      var realID = acc_id+'panel';
      var add = document.getElementById(realID);
        if(add.style.display == "none") {
            add.style.display = "block";
        } else {
            add.style.display = "none";
        }
    }

    function submitEdit(acc_id) {
      var accountName = document.getElementById(acc_id+"name");
      var accountRole = document.getElementById(acc_id+"role");
      var selectedRole = accountRole.options[accountRole.selectedIndex].value;
      var accountUsername = document.getElementById(acc_id+"username");
      var accountPassword = document.getElementById(acc_id+"password");
      var accountWorkplace =  document.getElementById(acc_id+"workplace");
      var selectedWorkplace = accountWorkplace.options[accountWorkplace.selectedIndex].id;
      console.log({
            role: selectedRole,
            name: accountName,
            username: accountUsername,
            password: accountPassword,
            workAt: selectedWorkplace
      })
      fetch('http://localhost:8080/account/edit?id=' + acc_id,{
          method: 'PUT',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': document.cookie
          },
          body: {
            role: selectedRole,
            name: accountName,
            username: accountUsername,
            password: accountPassword,
            workAt: selectedWorkplace
          }
      })
      .then((response) => response.json())
      .then((json) => {
          alert(json);
          toggleEditButton();
          render.value = render.value + 1;
      });
    }

    function getSelectedRole(accountID) {
    const dropdown = document.getElementById(accountID);
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    if (selectedOption) {
        const role = selectedOption.value;
        if (role == "1") {
            return "basemanager";
        } else if (role == "2") {
            return "transmanager";
        }
    }
    return "director";
    }

    function searchWorkplace(accountID) {
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
              var test = accountID + 'workplace';
              var workplaceName = document.getElementById(test);
              workplaceName.innerHTML = "";
              var selectedRole = getSelectedRole(accountID + 'role');
              console.log(selectedRole);
              var topLevelBases; 
              if(selectedRole == "basemanager" || selectedRole == "baseemployee") {
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

    defineExpose({
        getTickedAccounts,
        reset,
    });

    onUpdated(() => {
        reset()
    })
</script>

<template>
    <table>
      <thead>
        <th class="small" v-if="select">SELECT</th>
        <th class="large">ID</th>
        <th class="medium">Name</th>
        <th class="medium">Role</th>
        <th class="medium">Username</th>
        <th class="medium">Edit</th>
      </thead>
      <tbody>
        <div v-for="account in data" :key="account['_id']">
          <tr>
            <td class="small" v-if="select">
              <input type="checkbox" class="select_row" :id="account['_id']">
            </td>
            <td class="large">{{ account['_id'] }}</td>
            <td class="medium">{{ account['name'] }}</td>
            <td class="medium">{{ account['role'] }}</td>
            <td class="medium">{{ account['username'] }}</td>
            <td class="medium">
              <button @click="toggleEdit(account['_id'])">EDIT ACCOUNT</button>
            </td>
          </tr>
          <tr :id="account['_id']+'panel'" style="display: none;">
          <div id="editform"> 
          <div>
            <label for="fname">Full name:</label>
            <input type="text" :id="account['_id']+'name'" name="fname" :placeholder="account['name']">
          </div>
          <div>
            <label>Role: </label>
            <select name="role" :id="account['_id']+'role'" @change="searchWorkplace(account['_id'])">
              <option value="1">Base manager</option>
              <option value="2">Trans manager</option>
            </select>
          </div>
          <div>
            <label>Work at: </label>
            <select name="workplace" :id="account['_id']+'workplace'">
            </select>
          </div>
          <div>
            <label for="username">Username:</label>
            <input type="text" name="username" :id="account['_id']+'username'" :placeholder="account['username']">
          </div>
          <div>
            <label for="pass">Password:</label>
            <input type="text" name="pass" :id="account['_id']+'password'">
          </div>
          <div>
            <label for="repass">Re-password:</label>
            <input type="text" name="repass" :id="account['_id']+'repassword'">
          </div>
          <div class="submitbutton">
            <input class='formbutton' type="submit" value="Submit" @click="submitEdit(account['_id'])">
          </div>
          </div>
          </tr>
        </div>
      </tbody>
    </table>
  </template>
  
  <style scoped>
    table {
      border-collapse: collapse;
      width: 100%;
      padding: auto;
    }
    thead {
      height: 30px;
      display: flex;
      width: 100%;
      align-items: center;
      text-align: center;
      background-color: #FF914D;
    }
    tr {
      display: flex;
      width: 100%;
      align-items: center;
      font-weight: lighter;
    }
    td, th {
      display: flex;
      border: solid 1px;
      height: 100%;
      text-align: center;
      justify-content: center;
      align-items: center;
    }
    .small {
      flex: 2;
    }
    .medium {
      flex: 3;
    }

    .large {
      flex: 4;
    }

    #editform {
      position: sticky; 
      bottom: 0;
      background-color: #f1f1f1; 
      padding: 10px; 
      text-align: center;
      width: 480px;
      margin: auto;
      border: solid;
    }
  </style>
  