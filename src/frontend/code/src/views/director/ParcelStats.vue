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
        };
    },
    components: {
      Chart
    },
    mounted() {
        this.searchStatistics();
    },
    methods: {
        async fetchParcelStatistics(baseID) {
            const base_url = "http://localhost:8080/statistic/base?id=";
            const api_call_url = base_url + baseID;
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
            const allWorkplaces = document.getElementById("workplace");
            const selectedWorkplace = allWorkplaces.options[allWorkplaces.selectedIndex].id;
            try {
                const { totalParcel, totalReceivedParcel } = await this.fetchParcelStatistics(selectedWorkplace);
                this.totalParcel = totalParcel;
                this.totalReceivedParcel = totalReceivedParcel;
                this.monthlyChartKey += 1;
            }
            catch (error) {
                alert("Error happened");
            }
        },
        searchStatistics() {
            searchWorkplace();
            const base_url = "http://localhost:8080/statistic/general";
            const api_call_url = base_url;
            const xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = () => {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    const obj = JSON.parse(xmlhttp.responseText);
                    const dataTrans = obj['total'];
                    const dataReceivedTrans = obj['success'];
                    for (const data of dataTrans) {
                        this.totalTrans += parseInt(data.count);
                    }
                    for (const data of dataReceivedTrans) {
                        this.totalReceivedTrans += parseInt(data.count);
                    }
                }
            };
            xmlhttp.open("GET", api_call_url, true);
            xmlhttp.setRequestHeader("Authorization", document.cookie);
            xmlhttp.send(null);
        },

    },
};

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
              var topLevelBases;
              topLevelBases = obj['base'];
              for(var base of topLevelBases) {
                  var baseOption = document.createElement("option");
                  baseOption.value = base.baseLocation;
                  baseOption.textContent = base.baseLocation;
                  baseOption.id = base._id;
                  workplaceName.appendChild(baseOption);
              }
            }
        }
    }
    xmlhttp.open("GET", api_call_url2, true);
    xmlhttp.setRequestHeader("Accept", "application/json");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.setRequestHeader("Authorization", document.cookie);
    xmlhttp.send(null);
};
</script>

<template>
    <div class="parcelstats">
        <h1>
            Parcel Statistics
        </h1>
    </div>
    <div>
        <p>Total parcels sent to customers: {{ totalTrans }}</p>
        <p>Total parcels delivered by customers successfully: {{ totalReceivedTrans }}</p>
    </div>
    <p>
        <h2> Parcel send statistic table: </h2>
    </p>
    <div class="showItem"> 
        Choose a base or transaction center to show:
        <select id="workplace" name="workplace" @change="showParcel(), showChart = true"> 
        </select>
    </div>
    <div>
    <p>Total parcels sent to receivers: {{ totalParcel }}</p>
    <p>Total parcels received by customers successfully: {{ totalReceivedParcel }}</p>
    <p> Choose a base or depo to see the chart: </p>
    <div v-if="showChart">
      <Chart :monthlyData="monthlyChart" :legend="legend1" :key="monthlyChartKey"/>
      <Chart :monthlyData="monthlyChart2" :legend="legend2" :key="monthlyChartKey"/>
      <Chart :monthlyData="monthlyChart3" :legend="legend3" :key="monthlyChartKey"/>
     </div>
  </div>
</template>

<style scoped>
    .parcelstats {
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

    select, input {
        padding: 5px; 
        background:#edf2ff; 
        border: solid 2px black;
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