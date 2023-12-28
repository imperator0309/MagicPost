<script lang="ts" allowjs="true">
import AddAccount from '@/views/director/AddAccount.vue';
import BaseDialog from '@/views/director/BaseDialog.vue';
import EditAccount from '@/views/director/EditAccount.vue';
import EmployeeTable from '@/views/director/EmployeeTable.vue'

export default {
  data() {
    return {
      showAddAccount: false, show: false, showDelete: false, showEditForm: false,
      addAccountKey: 0, selectedRow: null,
    };
  },
  methods: {
    clickAddAccount() {
      this.showAddAccount = !this.showAddAccount;
      this.addAccountKey += 1;
    },
    toggleDeleteAccount(account) {
      deleteAccount(account);
    },
    handleRowSelected(row) {
      this.selectedRow = row;
    },
    submitEdit(editedAccount) {
      let xhr = new XMLHttpRequest();
      var base_url = "http://localhost:8080/account/edit?id="
      var api_call_url = base_url + editedAccount._id;
      xhr.open("PUT", api_call_url);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", document.cookie);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          console.log(xhr.status);
          console.log(xhr.responseText);
          alert('Account edited');
        }};

        this.showEditForm = !this.showEditForm;
    },
    cancelEdit() {
      this.showEditForm = !this.showEditForm;
    },
    searchAccount() {
    var base_url = "http://localhost:8080/account/view"
    var api_call_url = base_url;
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var obj = JSON.parse(this.responseText);
          var len = obj['accounts'].length;
          if (len == 0) {
              alert('Error in finding data');
              return ;
          } else {
              var old_body = document.querySelector("#output_table tbody");
              var new_body = document.createElement("tbody");
                              for (var i = 0; i < len; i++) {
                                  var row = document.createElement('tr');
                                  var number = document.createElement('td');
                                  var name = document.createElement('td');
                                  var role = document.createElement('td');
                                  var username = document.createElement('td');
                                  name.id = "account" + i.toString();
                                  number.innerHTML = i.toString();
                                  name.innerHTML = obj.accounts[i].name;
                                  role.innerHTML = obj.accounts[i].role;
                                  username.innerHTML = obj.accounts[i].username;
                                  row.appendChild(number);
                                  row.appendChild(name);
                                  row.appendChild(role);
                                  row.appendChild(username);
                                  new_body.appendChild(row);
                              }
                              document.getElementById("output_table").replaceChild(new_body, old_body);
                          }
                      }
                  }
          xmlhttp.open("GET", api_call_url, true);
          xmlhttp.setRequestHeader("Accept", "application/json");
          xmlhttp.setRequestHeader("Content-Type", "application/json");
          xmlhttp.setRequestHeader("Authorization", document.cookie);
          xmlhttp.send(null);
    }
  },
  components: {
    AddAccount, BaseDialog, EmployeeTable, EditAccount
  },
};

function deleteAccount(accountID) {
  let xhr = new XMLHttpRequest();
  xhr.open("DELETE", "http://localhost:8080/account/delete/");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", document.cookie)
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
    }};
  let data = [accountID];
  var jsonData = JSON.stringify(data);
  xhr.send(jsonData);
  alert('Account deleted');
  searchAccount();
}

function searchAccount() {
    var base_url = "http://localhost:8080/account/view"
    var api_call_url = base_url;
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var obj = JSON.parse(this.responseText);
          var len = obj['accounts'].length;
          if (len == 0) {
              alert('Error in finding data');
              return ;
          } else {
              var old_body = document.querySelector("#output_table tbody");
              var new_body = document.createElement("tbody");
                              for (var i = 0; i < len; i++) {
                                  var row = document.createElement('tr');
                                  var number = document.createElement('td');
                                  var name = document.createElement('td');
                                  var role = document.createElement('td');
                                  var username = document.createElement('td');
                                  name.id = "account" + i.toString();
                                  number.innerHTML = i.toString();
                                  name.innerHTML = obj.accounts[i].name;
                                  role.innerHTML = obj.accounts[i].role;
                                  username.innerHTML = obj.accounts[i].username;
                                  row.appendChild(number);
                                  row.appendChild(name);
                                  row.appendChild(role);
                                  row.appendChild(username);
                                  new_body.appendChild(row);
                              }
                              document.getElementById("output_table").replaceChild(new_body, old_body);
                          }
                      }
                  }
          xmlhttp.open("GET", api_call_url, true);
          xmlhttp.setRequestHeader("Accept", "application/json");
          xmlhttp.setRequestHeader("Content-Type", "application/json");
          xmlhttp.setRequestHeader("Authorization", document.cookie);
          xmlhttp.send(null);
    }
</script>

<template>
    <p class="left"> <button @click="searchAccount()">Get accounts</button> </p>
    <div class="accmanage">
      <h1>Account management</h1>
      <table id="output_table" class="table_container">
        <thead> 
          <tr>
              <th>ID</th>
              <th class="col1">Full name</th>
              <th class="col2">Role</th>
              <th class="col3">Username</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
    <p>
                <BaseDialog :active.sync="show">
                <h1>Choose an account to edit</h1>
                <EmployeeTable @row-selected="handleRowSelected"/>
                <p> <button class="dialogbutton" type="button" @click="showEditForm = !showEditForm"> Edit </button>
                <EditAccount v-if="showEditForm" :editedAccount="selectedRow" @submitForm="submitEdit(selectedRow)" @cancelEdit="cancelEdit" /> </p>
                <div id="dialog1"> <button class="dialogbutton" type="button" @click="show = !show">OK</button>
                <button class="dialogbutton" type="button" @click="show = !show">Close</button> </div>
                </BaseDialog>
                <BaseDialog :active.sync="showDelete">
                  <h1>Choose an account to delete</h1>
                  <p> <EmployeeTable @row-selected="handleRowSelected"/> </p>
                  <button class="dialogbutton" type="button" @click="toggleDeleteAccount(selectedRow._id)">Delete</button>
                  <button class="dialogbutton" type="button" @click="showDelete = !showDelete">Close</button>
                </BaseDialog>
        <div id="allbuttons"> <button type="button" @click="show = !show">Edit account</button>
        <button type="button" @click="showDelete = !showDelete">Delete account</button>
        <button @click="clickAddAccount()">Add an account</button> </div>
      <div v-if="showAddAccount" >
        <AddAccount :key="addAccountKey"/>
      </div>
    </p>
</template>

<style scoped>
    .accmanage {
        text-align: center;
    }
    .col1 {
        width: 400px;
    }

    .col2 {
        width: 200px;
    }

    .col3 {
        width: 200px;
    }

    table {
      border-collapse: collapse;
      width: 80%; 
      border: 1px solid #ddd; 
      margin: 0 auto; 
      align-items: center;
      justify-content: center;
    }

    table:empty {
        border: none; 
    }
    .table_container {
      display: inline-block;
    }

    th, td {
      border: 1px solid #ddd; 
      padding: 8px;
      text-align: center;
    }

    th {
      background-color: #f2f2f2; 
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

    button + button {
      margin-left: 20px;
    }

    .left {
      justify-content: left;
    }

    #dialog1 {
      display: flex;
      align-items: center;
    }
    #allbuttons {
      display: flex;
      align-items: center;
    }
    
    div button {
      align-items: center;
    }
  </style>