<script setup>
import { toRef, ref, onUpdated } from 'vue';

    const props = defineProps({
        data: Array,
        selected: Array,
        select: Boolean
    })

    function getParcels() {
        var checkBoxes = document.getElementsByClassName('select_row');
        var selectedID = [];
        for (var i = 0; i < checkBoxes.length; i++) {
            if (checkBoxes[i].checked) {
                selectedID.push(checkBoxes[i].id);
            }
        }
        return selectedID;
    }

    function reset() {
        var checkBoxes = document.getElementsByClassName('select_row')
        for (var i = 0; i < checkBoxes.length; i++) {
            checkBoxes[i].checked = false
        }
        var selected = toRef(props).value.selected
        for (var row = 0; row < selected.length; row++) {
            for (var i = 0; i < selected[row].length; i++) {
                var box = checkBoxes[selected[row][i]]
                if (box != null) {
                    console.log(box.id)
                    box.checked = true
                }
            }
        }
    }

    function toggleDetails(parcel_id) {
        var button = document.getElementById(parcel_id+'details');
        var panel = document.getElementById(parcel_id+'panel');
        if (button.textContent == 'DETAILS') {
            panel.style = ''
            button.textContent = 'HIDE'
        } else {
            panel.style.display = 'none'
            button.textContent = 'DETAILS'
        }
    }

    function get_status(code) {
        if (code == 0) {
            return 'being processed'
        }
        if (code == 1) {
            return 'delivering'
        }
        if (code == 2) {
            return 'shipping to receiver'
        }
        if (code == 3) {
            return 'delivered'
        }
        if (code == 4) {
            return 'returned'
        }
        return 'error'
    }

    function date_handle(date) {
        var date_obj = new Date(new Date(date))
        var final = '' + date_obj.getDate() + '/' + (date_obj.getMonth() + 1) + '/' + (date_obj.getFullYear())
        final += ' ' + date_obj.getHours() + ':' + date_obj.getMinutes() + ':' +date_obj.getSeconds()
        return final
    }
    
    defineExpose({
        getParcels,
        reset,
    });

    onUpdated(() => {
        reset()
    })
</script>

<template>
    <table>
        <thead>
            <th class="small" v-if="select">SELECT</th>
            <th class="medium">PARCEL ID</th>
            <th class="medium">SENDER</th>
            <th class="medium">RECEIVER</th>
            <th class="large">ORDER DATE</th>
            <th class="small">STATUS</th>
            <th class="small">DETAILS</th>
        </thead>
        <tbody>
            <div v-for="parcel in data" :id="parcel['_id']">
                <tr>
                    <td class="small" v-if="select">
                        <input type="checkbox" class="select_row" :id="parcel['_id']">
                    </td>
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
                        {{ date_handle(parcel['orderDate']) }}
                    </td>
                    <td class="small">
                        {{ get_status(parcel['status']) }}
                    </td>
                    <td class="small">
                        <button :id="parcel['_id'] + 'details'" @click="toggleDetails(parcel['_id'])">DETAILS</button>
                    </td>
                </tr>
                <tr :id="parcel['_id'] + 'panel'" style="display: none;" class="details">
                    <td style="width: 100%;">
                        <ul>
                            <li v-for="passed in parcel['passedBases']">
                                {{ passed['id'] }} - {{ passed['baseLocation'] }} -  {{ date_handle(passed['timestamp']) }}
                            </li>
                        </ul>
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
        height: 70px;
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
        height: max-content;
    }
</style>