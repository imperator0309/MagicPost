<script>
import EditAccount from '@/views/base-manager/EditAccount.vue';

export default {
  components: {
    EditAccount
  },
  emits: ['row-selected'],
  data: () => ({
    items: [],
    selectedRows: [],
    showEditForm: false
  }),
  mounted() {
    this.loadData();
  },
  methods: {
    isSelected(item) {
      return this.selectedRows.indexOf(item) !== -1;
    },
    toggleSelected(item) {
      const index = this.selectedRows.indexOf(item);
      if (index === -1) {
        this.selectedRows = [];
        this.selectedRows.push(item);
      } else {
        this.selectedRows.splice(index, 1);
      }
      this.$emit('row-selected', this.selectedRows[0]);
    },
    getRole(role) {
          if(role == 0) {
              return "Manager";
          }
          if(role == 1) {
              return "Base manager";
          }
          if(role == 2) {
              return "Transaction manager";
          }
          if(role == 3) {
              return "Base employee";
          }
          if(role == 4) {
              return "Transaction employee";
          }
    },
    loadData() {
      this.getData().then((data) => {
        this.items = data;
      }).catch((error) => {
        console.error('Error fetching data:', error);
      });
    },
    getData() {
      return new Promise((resolve, reject) => {
        var base_url = "http://localhost:8080/account/view"
        var api_call_url = base_url;
        var xmlhttp = new XMLHttpRequest();
        
        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (this.status == 200) {
              var obj = JSON.parse(this.responseText);
              var len = obj['accounts'].length;
              if (len === 0) {
                reject(new Error("Error in fetching data, please try again!"));
              } else {
                var data = obj.accounts.map(account => {
                  return {
                    id: account.id,
                    name: account.name,
                    role: account.role,
                    username: account.username
                  };
                });
                resolve(data);
              }
            } else {
              reject(new Error('Failed to fetch data'));
            }
          }
        };
        xmlhttp.open("GET", api_call_url, true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.setRequestHeader("Authorization", document.cookie);
        xmlhttp.send(null);
      });
    }
  },
};
</script>

<template>
    <table id="employeetable">
      <thead>
        <tr>
          <th>Full name</th>
          <th id="col2">Role</th>
          <th>Username</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id" :class="{ 'selected': isSelected(item) }"
          @click="toggleSelected(item)">
          <td>{{ item.name }}</td>
          <td id="col2">{{ getRole(item.role) }}</td>
          <td>{{ item.username }}</td>
        </tr>
      </tbody>
   </table>
   <div v-if="selectedRows.length > 0">
      <p> Selected <strong> {{ selectedRows[0].name }} </strong> with username <strong> {{ selectedRows[0].username }} </strong> </p>
    </div>
</template>

<style scoped>
    table {
      border-collapse: collapse;
      max-width: 80%;
      margin: 20px auto;
    }

    th,
    td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      cursor: pointer;
    }

    th {
      background-color: #f2f2f2;
      text-align: center;
    }

    tr:hover {
      background-color: lightsalmon;
    }

    .selected {
      background-color: orange;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }
    
    #col2 {
        width: 200px;
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

    @media screen and (max-width: 600px) {
      table {
        font-size: 14px;
      }
    }

    @media screen and (max-width: 400px) {
      table {
        font-size: 12px;
      }
    }
</style>