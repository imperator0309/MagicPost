<script>
import { default as Chart } from '@/components/Chart.vue';

export default {
    data() {
        return {
            totalTrans: 0,
            totalReceivedTrans: 0,
            totalParcel: 0,
            totalReceivedParcel: 0,
            totalPriceParcel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            totalArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            receivedArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            priceArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            showChart: false,
            monthlyChart: [], monthlyChart2: [], monthlyChart3: [], 
            monthlyChartKey: 0,
            legend1: "Total parcels sent",
            legend2: "Total parcels received by customers",
            legend3: "Total price",
            workID: "", workLocation: ""
        };
    },
    components: {
      Chart
    },
    mounted() {
        this.fetchBaseInfo();
    },
    methods: {
        async fetchParcelStatistics() {
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
                        this.totalArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        this.receivedArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        this.totalPriceParcel = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        for (var data of dataTrans) {
                            totalParcel += parseInt(data.count);
                            this.totalArr[parseInt(data._id)-1] = parseInt(data.count);
                            this.totalPriceParcel[parseInt(data._id)-1] += parseInt(data.totalPrice);
                        }
                        for (var data of dataReceivedTrans) {
                            totalReceivedParcel += parseInt(data.count);
                            this.receivedArr[parseInt(data._id)-1] = data.count;
                        }
                        this.monthlyChart = this.totalArr;
                        this.monthlyChart2 = this.receivedArr;
                        this.monthlyChart3 = this.totalPriceParcel;
                        resolve({ totalParcel, totalReceivedParcel});
                    }
                };
                xmlhttp.open("GET", api_call_url, true);
                xmlhttp.setRequestHeader("Authorization", document.cookie);
                xmlhttp.send(null);
            });
        },
        async showParcel() {
            try {
                const { totalParcel, totalReceivedParcel } = await this.fetchParcelStatistics();
                this.totalParcel = totalParcel;
                this.totalReceivedParcel = totalReceivedParcel;
                this.monthlyChartKey += 1;
            }
            catch (error) {
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
        xmlhttp.setRequestHeader("Authorization", document.cookie)
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
};
</script>

<template>
    <div class="transstats">
        <h1>
            Parcel Statistics
        </h1>
        <h3> Base: {{ workLocation }}</h3>
    </div>
    <div>
      <button @click="showParcel(), showChart = !showChart"> Show info </button>
        <p>Total sent parcels: {{ totalParcel }}</p>
        <p>Total received parcels: {{ totalReceivedParcel }}</p>
    </div>
    <div>
    <p> Choose a base or depo to see the chart: </p>
    <div v-if="showChart">
      <Chart :monthlyData="monthlyChart" :legend="legend1" :key="monthlyChartKey"/>
      <Chart :monthlyData="monthlyChart2" :legend="legend2" :key="monthlyChartKey"/>
      <Chart :monthlyData="monthlyChart3" :legend="legend3" :key="monthlyChartKey"/>
     </div>
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