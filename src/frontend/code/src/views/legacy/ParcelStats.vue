<template>
    <div class="parcelstats">
        <h1>
            Parcel Statistics
        </h1>
    </div>
    <div>
        <p>Total sent parcels: {{  }}</p>
        <p>Total received parcels: {{  }}</p>
    </div>
    <p>
        <h2> Parcel send statistic table: </h2>
    </p>
    <table>
        <thead>
            <tr>
                <th rowspan="2">Trade date</th>
                <th rowspan="2">Trade address</th>
                <th colspan="5">Sent parcels</th>
                <th rowspan="2">Fee</th>
                <th rowspan="2">Note</th>
            </tr>
            <tr>
                <th>Parcel ID</th>
                <th>Sender's name</th>
                <th>Sender's address</th>
                <th>Weight</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            
        </tbody>
    </table>
    <p>
        <h2> Parcel receive statistic table: </h2>
    </p>
    <table>
        <thead>
            <tr>
                <th rowspan="2">Trade date</th>
                <th rowspan="2">Trade address</th>
                <th colspan="5">Received parcels</th>
                <th rowspan="2">Fee</th>
                <th rowspan="2">Note</th>
            </tr>
            <tr>
                <th>Parcel ID</th>
                <th>Receiver's name</th>
                <th>Receiver's address</th>
                <th>Weight</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            
        </tbody>
    </table>
</template>

<style scoped>
    .parcelstats {
        text-align: center;
    }

    table {
      border-collapse: collapse;
      width: 100%; 
      border: 1px solid #ddd; 
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
      cursor: pointer;
      margin-right: 5px;
    }
</style>