<script lang="ts" allowjs="true">
import AddAccount from './AddAccount.vue';
import EditAccount from './EditAccount.vue';

export default {
  methods: {
    navDes(param: string, username: string) {
      if(param === "add") {
          this.$router.push('/accmanage/addaccount');
      }
      else if(param === "edit") {
          this.$router.push('/accmanage/editaccount/' + username);
      }
      else {
          var result = window.confirm("Do you want to delete this account?");
          if (result) {
              alert("Account deleted");
              //Delete account in the database
              //Re-fetch the data table
          }
        }
    },
    clickAddAccount() {
      this.showAddAccount = !this.showAddAccount;
    },
    clickEditAccount() {
      this.showEditAccount = !this.showEditAccount;
    }
  },
  components: {
    AddAccount, EditAccount
  },
  data() {
    return {
      showAddAccount: false, showEditAccount: false
    };
  },
};

</script>

<template>
    <div class="accmanage">
      <h1>Account management</h1>
      <table>
        <thead> 
          <tr>
              <th class="col1">Full Name</th>
              <th class="col2">Role</th>
              <th class="col3">Username</th>
              <th class="col4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="col1">Chanchan</td>
            <td class="col2">Base manager</td>
            <td class="col3">chanchan021</td>
            <td class="col4">
              <button @click="navDes('edit', 'chanchan021'), clickEditAccount()">Edit</button> 
              <button @click="navDes('delete', '')">Delete</button>
            </td>
          </tr>
          <tr>
            <td class="col1">Rinkun</td>
            <td class="col2">Manager</td>
            <td class="col3">rinkun812</td>
            <td class="col4">
              <button @click="navDes('edit', 'rinkun812'), clickEditAccount()">Edit</button> 
              <button @click="navDes('delete', '')">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p> 
      <button @click="clickAddAccount()">Add an account</button>
      <div v-if="showAddAccount">
        <AddAccount />
      </div>
    </p>
<!-- <tbody>
      <tr v-for="(account, index) in accounts" :key="index">
        <td id="col1">{{ account.fullName }}</td>
        <td id="col2">{{ account.role }}</td>
        <td id="col3">{{ account.username }}</td>
        <td id="col4">
          <button>Edit</button>
          <button>Delete</button>
        </td>
      </tr>
      
</tbody> -->
</template>

<style scoped>
    .accmanage {
        text-align: center;
    }

    .col1 {
        width: 300px;
    }

    .col2, .col3 {
        width: 200px;
    }

    .col4 {
        width: 260px;
    }

    table {
      border-collapse: collapse;
      width: 100%; 
      border: 1px solid #ddd; 
      margin: 0 auto; 
      align-items: center;
      justify-content: center;
    }

    table:empty {
        border: none; 
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
  </style>