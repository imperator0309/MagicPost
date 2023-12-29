<script>
export default {
  props: {
    editedAccount: Object,
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
  },
};

function getSelectedRole() {
    const dropdown = document.getElementById("role");
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    if (selectedOption) {
        const role = selectedOption.value;
        if (role == "1") {
            return "basemanager";
        } else if (role == "2") {
            return "transmanager";
        } else if (role == "3") {
            return "baseemployee";
        } else if (role == "4") {
            return "transemployee"
        }
    }
    return "director";
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
</script>

<template>
  <div>
    <form @submit.prevent="checkValid">
      
    </form>
  </div>
</template>

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
