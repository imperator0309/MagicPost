<script>
import BaseDialog from '@/views/director/BaseDialog.vue';
import TreeView from '@/views/director/TreeView.vue';

export default {
  components: {
    TreeView, BaseDialog
  },
  data() {
    return {
      treeData: [], show: false, showDelete: false,
    };
  },
  mounted() {
    this.getjsonData();
  },
  methods: {
    async getjsonData() {
    try {
      const base_url = "http://localhost:8080/base/view";
      const api_call_url = base_url;

      const response = await fetch(api_call_url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const obj = await response.json();
      const len = obj['base'].length;

      if (len === 0) {
        alert("No workplaces available");
      } else {
        const buildTree = (base, depth = 0) => {
          const children = obj['base'].filter(child => child.superiorBase === base._id);
          if (children.length === 0 || depth > 5) {
            return {
              name: base.baseLocation,
            };
          }
          return {
            name: base.baseLocation,
            children: children.map(child => buildTree(child, depth + 1)),
          };
        };

        const topLevelBases = obj['base'].filter(base => base.baseType === 0);
        this.treeData = topLevelBases.map(buildTree);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }
},
}
</script>

<template>
  <div class="basetrade">
    <h1>Base and Transaction information</h1>
    <h3> Currently we have these bases and transactions below: </h3>
    <TreeView :data="treeData"></TreeView>
  </div>
</template>

<style scoped>
    body {
      font-family: Arial, sans-serif;
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