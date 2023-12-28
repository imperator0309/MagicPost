<template>
    <div class="nationalstats">
        <h1>Parcel Shipping and Receiving in Nationwide</h1>
        <table>
        <thead>
            <tr>
            <th rowspan="2">Trade date</th>
            <th rowspan="2">Trade address</th>
            <th colspan="6">Sent and Received Parcels</th>
            <th rowspan="2">Fee</th>
            <th rowspan="2">Note</th>
            <th rowspan="2">Status</th>
            </tr>
            <tr>
            <th>Parcel ID</th>
            <th>Sender's name</th>
            <th>Sender's address</th>
            <th>Receiver's name</th>
            <th>Receiver's address</th>
            <th>Weight</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td>2023-01-15</td>
            <td>Trade Point A, Ha Noi</td>
            <td>OD12345</td>
            <td>Chanchan</td>
            <td>Sender Address</td>
            <td></td>
            <td>Receiver Address</td>
            <td>5kg</td>
            <td>Delivered</td>
            <td>10k</td>
            <td></td>
            </tr>
        </tbody>
        </table>
    </div>
</template>

<style scoped>
    body {
      font-family: Arial, sans-serif;
    }

    table {
      border-collapse: collapse;
      width: 100%;
    }

    th, td {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
    }

    th {
      background-color: #f2f2f2;
    }
</style>