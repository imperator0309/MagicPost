<template>
  <div>
    <form @submit.prevent="checkValid">
      <div>
        <label for="fname">Full name:</label>
        <input type="text" id="fname" name="fname" v-model="editedAccount.name">
      </div>
      <div>
        <label>Role: </label>
        <select id="role" name="role" v-model="editedAccount.role">
          <option value="basemanager" :disabled="disabledRole">Base manager</option>
          <option value="transmanager" :disabled="disabledRole">Trans manager</option>
          <option value="baseemployee" :disabled="disabledRole">Base employee</option>
          <option value="transemployee">Trans employee</option>
        </select>
      </div>
      <div>
        <label>Work at: </label>
        <select id="workplace" name="workplace" v-model="editedAccount.workplace" @click="searchWorkplace()">
        </select>
      </div>
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" v-model="editedAccount.username">
      </div>
      <div>
        <label for="pass">Password:</label>
        <input type="text" id="pass" name="pass" v-model="editedAccount.password">
      </div>
      <div>
        <label for="repass">Re-password:</label>
        <input type="text" id="repass" name="repass" v-model="editedAccount.repassword">
      </div>
      <div class="submitbutton">
        <input class='formbutton' type="submit" value="Submit">
        <input class='formbutton' style="margin-left: auto;" type="button" value="Cancel" @click="cancelEdit">
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    editedAccount: Object, 
  },
  data() {
    return {
      disabledRole: true
    };
  },
  mounted() {
    this.searchWorkplace();
  },
  methods: {
    checkValid() {
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
      this.$emit('submitForm', this.editedAccount);
    },
    cancelEdit() {
      this.$emit('cancelEdit');
    },
    searchWorkplace() {
    var base_url = "http://localhost:8080/my"
    var api_call_url = base_url;
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var obj = JSON.parse(this.responseText);
          var len = obj.length;
          if (len == 0) {
            alert("No workplaces available");
          } else {
            var workplaceName = document.getElementById("workplace");
            workplaceName.innerHTML = "";
            var baseOption = document.createElement("option");
            baseOption.value = obj.baseLocation;
            baseOption.textContent = obj.baseLocation;
            workplaceName.appendChild(baseOption);
            return ;
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
};
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
