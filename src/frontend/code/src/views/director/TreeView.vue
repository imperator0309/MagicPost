<template>
  <ul>
    <li v-for="item in data">
      <span @click="toggleOpen">
        <i :class="isOpen ? 'icon-open' : 'icon-closed'"></i> {{ item.name }} 
        <button @click="editItem(item)">Edit</button>
        <button @click="deleteItem(item)">Delete</button>
        <button @click="addItem(item)">Add</button>
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
      editItem(item) {
      const newName = prompt('Enter a new name:', item.name);
      if (newName !== null) {
        item.name = newName;
      }
    },

    deleteItem(item) {
      const index = this.data.indexOf(item);
      if (index !== -1) {
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
          children: []
        };
        if (!item.children) {
          this.$set(item, 'children', []);
        }

        item.children.push(newItem);
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


</style>