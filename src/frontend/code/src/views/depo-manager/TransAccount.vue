<script>
import AddAccount from '@/views/depo-manager/AddAccount.vue';
import EmployeeTable from '@/views/depo-manager/EmployeeTable.vue';
import EditAccount from '@/views/depo-manager/EditAccount.vue';
import BaseDialog from '@/views/depo-manager/BaseDialog.vue'

export default {
  components: {
    AddAccount, BaseDialog, EmployeeTable, EditAccount
  },
  data() {
    return {
      showAddAccount: false, show: false, showDelete: false, showEditForm: false,
      document, selectedRow: null, workID: "", workLocation: "" 
    };
  },
  methods: {
    clickAddAccount() {
      this.showAddAccount = !this.showAddAccount;
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
      xhr.setRequestHeader("Authorization", sessionStorage.getItem("jwt"))
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          alert('Account edited');
        }};
        this.showEditForm = !this.showEditForm;
    },
    cancelEdit() {
      this.showEditForm = !this.showEditForm;
    },
    deleteAccount(accountID) {
      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", "http://localhost:8080/account/delete/");
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", sessionStorage.getItem("jwt"))
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          console.log(xhr.status);
          console.log(xhr.responseText);
        }};
      let data = [accountID];
      var jsonData = JSON.stringify(data);
      xhr.send(jsonData);
      alert('Account deleted');
      this.searchAccount();
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
                      var staffname = document.createElement('td');
                      var staffrole = document.createElement('td');
                      var staffusername = document.createElement('td');
                      staffname.id = "account" + i.toString();
                      number.innerHTML = i.toString();
                      staffname.innerHTML = obj.accounts[i].name;
                      staffrole.innerHTML = obj.accounts[i].role;
                      staffusername.innerHTML = obj.accounts[i].username;
                      row.appendChild(number);
                      row.appendChild(staffname);
                      row.appendChild(staffrole);
                      row.appendChild(staffusername);
                      new_body.appendChild(row);
                    }
                  document.getElementById("output_table").replaceChild(new_body, old_body);
                }
            }
        }
      xmlhttp.open("GET", api_call_url, true);
      xmlhttp.setRequestHeader("Authorization", sessionStorage.getItem("jwt"))
      xmlhttp.send(null);
    },
    getBaseInfo() {
      var base_url = "http://localhost:8080/my";
      var api_call_url = base_url;
      
      return new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (this.status == 200) {
              var obj = JSON.parse(this.responseText);
              var len = obj.length;
              if (len != 0) {
                var id = obj.workAt;
                var location = obj.baseLocation;
                resolve({ id, location });
              } else {
                reject('Error in finding data');
              }
            } else {
              reject('Error in the HTTP request');
            }
          }
        };
        xmlhttp.open("GET", api_call_url, true);
        xmlhttp.setRequestHeader("Authorization", sessionStorage.getItem("jwt"))
        xmlhttp.send(null);
      });
    },
    async fetchBaseInfo() {
      try {
        const { id, location } = await this.getBaseInfo();
        this.workID = id;
        this.workLocation = location;
      } catch (error) {
        alert("Error happened");
      }
    },
  },
  mounted() {
    this.fetchBaseInfo();
  },
};
</script>

<template>
    <p class="left"> <button @click="searchAccount">Get accounts</button> </p>
    <div class="baseaccount">
      <h1>Account management</h1>
      <h3> Trans: {{ workLocation }}</h3>
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
                  <p> <EmployeeTable @row-selected="handleRowSelected"> </EmployeeTable> </p>
                  <button class="dialogbutton" type="button" @click="deleteAccount(selectedRow._id)">Delete</button>
                  <button class="dialogbutton" type="button" @click="showDelete = !showDelete">Close</button>
                </BaseDialog>
        <div id="allbuttons"> <button type="button" @click="show = !show">Edit account</button>
        <button type="button" @click="showDelete = !showDelete">Delete account</button>
        <button @click="clickAddAccount()">Add an account</button> </div>
        <div v-if="showAddAccount"> 
          <AddAccount :disableTrans="true"> </AddAccount>
        </div>
    </p>
    </p>
</template>

<style scoped>
    .baseaccount {
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
      width: 50%; 
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
  </style>