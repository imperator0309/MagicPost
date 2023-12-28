<script setup>
    const props = defineProps({
        data: Array,
    })
</script>

<template>
    <table>
        <thead>
            <th class="medium">PARCEL ID</th>
            <th class="medium">SENDER</th>
            <th class="medium">RECEIVER</th>
            <th class="large">ORDER DATE</th>
            <th class="small">STATUS</th>
            <th class="medium">LAST LOCATION</th>
        </thead>
        <tbody>
            <div v-for="parcel in data" :id="parcel['_id']">
                <tr>
                    <td class="medium">{{ parcel['_id'] }}</td>
                    <td class="medium">
                        {{ parcel['senderName'] }} <br>
                        {{ parcel['senderPhone'] }} <br>
                        {{ parcel['sentFrom'] }} <br>
                    </td>
                    <td class="medium">
                        {{ parcel['receiverName'] }} <br>
                        {{ parcel['receiverPhone'] }} <br>
                        {{ parcel['sentTo'] }} <br>
                    </td>
                    <td class="large">
                        {{ parcel['orderDate'] }}
                    </td>
                    <td class="small">
                        {{ parcel['status'] }}
                    </td>
                    <td class="medium">
                        {{ parcel['passedBases']['baseLocation'] }}<br>
                        {{ parcel['passedBases']['timestamp'] }}
                    </td>
                </tr>
            </div>
        </tbody>
    </table>
</template>

<style scoped>
    table {
        border-collapse: collapse;
        width: 100%;
        padding: auto;
    }
    thead {
        height: 30px;
        display: flex;
        width: 100%;
        align-items: center;
        text-align: center;
        background-color: #FF914D;
    }
    tr {
        display: flex;
        width: 100%;
        align-items: center;
        height: 65px;
        font-weight: lighter;
    }
    td, th {
        display: flex;
        border: solid 1px;
        height: 100%;
        text-align: center;
        justify-content: center;
        align-items: center;
    }
    .small {
        flex: 1;
    }
    .large {
        flex: 3;
    }
    .medium {
        flex: 2;
    }

    li:first-of-type {
        color: red;
    }
    
    li {
        color: gray;
    }

    ul {
        flex-direction: column;
    }
</style>