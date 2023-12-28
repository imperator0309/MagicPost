<script>
export default {
  data() {
    return {
      totalParcel: 0,
      totalReceivedParcel: 0,
      workID: "", workLocation: ""
    };
  },
  methods: {
    async fetchParcelStatistics(baseID) {
    const base_url = "http://localhost:8080/statistic/general";
    const api_call_url = base_url;
    return new Promise((resolve, reject) => {
      const xmlhttp = new XMLHttpRequest();
      
      xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          const obj = JSON.parse(xmlhttp.responseText);
          const dataTrans = obj['total'];
          const dataReceivedTrans = obj['delivered'];
          let totalParcel = 0;
          let totalReceivedParcel = 0;

          for (const data of dataTrans) {
            totalParcel += parseInt(data.count);
          }

          for (const data of dataReceivedTrans) {
            totalReceivedParcel += parseInt(data.count);
          }

          resolve({ totalParcel, totalReceivedParcel });
        }
      };
      xmlhttp.open("GET", api_call_url, true);
      xmlhttp.setRequestHeader("Authorization", sessionStorage.getItem("jwt"));
      xmlhttp.send(null);
    });
    },
    async showParcel() {
      try {
        const { totalParcel, totalReceivedParcel } = await this.fetchParcelStatistics(this.workID);
        this.totalParcel = totalParcel;
        this.totalReceivedParcel = totalReceivedParcel;
      } catch (error) {
        alert("Error happened");
      }
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
    <div class="transstats">
        <h1>
            Parcel Statistics
        </h1>
        <h3> Trans: {{ workLocation }}</h3>
    </div>
    <div>
      <button @click="showParcel()"> Show info </button>
        <p>Total sent parcels: {{ totalParcel }}</p>
        <p>Total received parcels: {{ totalReceivedParcel }}</p>
    </div>
</template>

<style scoped>
    .transstats {
        text-align: center;
    }

    .showItem {
        display: flex;
        max-height: 30px;
        gap: 10px;
        margin-bottom: 30px;
        justify-content: center;
    }

    table {
      border-collapse: collapse;
      width: 100%; 
      border: none; 
      margin: 0; 
      display: flex;
      align-items: center;
      justify-content: center;
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
      justify-content: center;
    }

    button:hover, 
    button:active {
        background-color: #fb8332;
        box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    }
  </style>