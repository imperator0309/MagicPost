<template>
  <ul>
    <li v-for="item in data">
      <span @click="toggleOpen">
        <i :class="isOpen ? 'icon-open' : 'icon-closed'"></i> {{ item.name }} 
        <button v-if="isTopLevel(item)" @click="deleteItem(item)">Delete</button>
        <button v-if="isTopLevel(item) && item.children" @click="addItem(item)">Add</button>
        <button v-if="!isTopLevel(item)" @click="deleteItem(item)">Delete</button>
      </span>
      <TreeView v-if="isOpen && item.children" :data="item.children"></TreeView>
    </li>
  </ul>
</template>
  
<script>
export default {
  name: 'TreeView',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen;
    },
    isTopLevel(item) {
      return !item._parent;
    },
    sendDeleteBase(item) {
      fetch('http://localhost:8080/base/delete',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': document.cookie
            },
            body: JSON.stringify({ 
                baseIDs: item.id
            })
        })
        .then((response) => response.json())
        .then((json) => {
            alert("Deleted successfully");
            fetch('http://localhost:8080/base/view',{
                method: 'GET',
                headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': document.cookie,
                        'Cache-control': 'no-cache'
                    },
                })
                .then((response) => response.json())
                .then((json) => {
                });
        });
    },
    sendAddBase(item) {
      if(!this.isTopLevel(item)) {
        fetch('http://localhost:8080/base/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': document.cookie
            },
            body: JSON.stringify({
                baseData: {
                  baseLocation: item.name,
                  baseType: 2,
                  superiorBase: (item._parent).id
                }
            })
        })
        .then(response => {
            if(response['status'] == '200') {
                alert('Parcel submitted succesfully!')
                fetch('http://localhost:8080/base/view',{
                method: 'GET',
                headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': document.cookie,
                        'Cache-control': 'no-cache'
                    },
                })
                .then((response) => response.json())
                .then((json) => {
                });
            } else {
                alert('Error: ' + response['statusText'])
            }
        })
      } else {
        fetch('http://localhost:8080/base/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': document.cookie
            },
            body: JSON.stringify({
                baseData: {
                  baseLocation: item.name,
                  baseType: 1,
                }
            })
        })
        .then(response => {
            if(response['status'] == '200') {
                alert('Parcel submitted succesfully!')
                fetch('http://localhost:8080/base/view',{
                method: 'GET',
                headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': document.cookie,
                        'Cache-control': 'no-cache'
                    },
                })
                .then((response) => response.json())
                .then((json) => {
                    data = json;
                    console.log(data);
                });
            } else {
                alert('Error: ' + response['statusText'])
            }
        })
      }
    },
    deleteItem(item) {
      const index = this.data.indexOf(item);
      if (index !== -1) {
        this.sendDeleteBase(item);
        this.data.splice(index, 1);

        if (item.type === 'base' && item.children) {
          for (const transactionCenter of item.children) {
            this.deleteItem(transactionCenter);
          }
        }
      }
    },
    addItem(item) {
      const newItemName = prompt('Enter the name for the new item:');
      if (newItemName !== null) {
        const newItem = {
          id: generateUniqueId(),
          name: newItemName,
          children: [],
          _parent: item,
        };
        if (!item.children) {
          this.$set(item, 'children', []);
        }
        item.children.push(newItem);
        this.sendAddBase(newItem);
      }
    }
  }
};

function generateUniqueId() {
  return Math.random().toString(36).substring(2, 10);
}
</script>
  
<style scoped>
ul {
  padding-left: 10px; 
}

li {
  margin-bottom: 10px; 
}

span + ul, ul + span {
  margin-top: 10px; 
}

span {
  cursor: pointer;
  display: inline-block;
}

.icon-open:before {
  content: '\25BC'; 
  margin-right: 5px;
}

.icon-closed:before {
  content: '\25B6';
  margin-right: 5px;
}

ul, li {
  list-style: none;
}

button {
  padding: 5px;
}

button + button {
      margin-left: 20px;
}
</style>
