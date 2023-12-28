<script setup>
    import { onMounted, ref, toRef } from 'vue';
    const props = defineProps({
        data: Object
    })
    // deliver status:
    // 0: delivering
    // 1: success
    // 2: fail
    const var_id = toRef(props).value.data["_id"]
    var visible_details = true
    var key = ref(0)

    function toggle_details() {
        if (!visible_details) {
            visible_details = true
            document.getElementById(var_id).style.display = ""
        } else {
            visible_details = false
            document.getElementById(var_id).style.display = "none"
        }
        document.getElementsByTagName("li")[0].className = "active"
    }

    function date_handle(date) {
        var date_obj = new Date(new Date(date))
        var final = '' + date_obj.getDate() + '/' + (date_obj.getMonth() + 1) + '/' + (date_obj.getFullYear())
        final += ' ' + date_obj.getHours() + ':' + date_obj.getMinutes() + ':' +date_obj.getSeconds()
        return final
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

    onMounted(() => {
        toggle_details()
    })
</script>

<template>
    <div class="overview">
        <div class="col">
            <div class="first_item">
                <div class="left">
                    Parcel ID:
                </div>
                <div class="right">
                    {{ data['_id'] }}
                </div>
            </div>
            <div class="item">
                <div class="left">
                    Sender:
                </div>
                <div class="right">
                    {{ data['senderName'] }} - {{ data['sendFrom'] }}
                </div>
            </div>
            <div class="item">
                <div class="left">
                    Receiver:
                </div>
                <div class="right">
                    {{ data['receiverName'] }} - {{ data['sendTo'] }}
                </div>
            </div>
        </div>
        <div class="col">
            <div class="first_item">
                <div class="left">
                    Weight:
                </div>
                <div class="right">
                    {{ data['weight'] }} kilogram(s)
                </div>
            </div>
            <div class="item">
                <div class="left">
                    Status:
                </div>
                <div class="right">
                    {{ get_status(data["status"]) }}
                </div>
            </div>
            <div class="item">
                <div class="left"></div>
                <div class="toggle right" @click="toggle_details()">
                    SHOW MORE DETAILS
                </div>
            </div>
        </div>
    </div>
    <div class="details" :id="data['_id']" :key="key">
        <ul>
            <li v-for="base in data['passedBases']">
                {{ base['baseLocation'] }} <br>
                Arrived at: {{ date_handle(base['timestamp']) }} <br>
                Left at: {{ date_handle(base['leave']) }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
    * {
        font-size: large;
    }
    .overview {
        display: flex;
        gap: 20px;
        background-color: lightgray;
    }
    .col {
        flex: 1;
        padding-left: 20px;
    }

    .col + .col {
        border-left: solid 3px white;
    }
    .item {
        padding-top: 30px;
    }
    .left {
        float: left;
        clear: right;
        font-weight: bold;
    }
    .right {
        float: right;
    }

    .details {
        padding-top: 20px;
        padding-left: 20px;
    }
    .toggle {
        color: #FF914D;
        text-decoration: underline;
        cursor: pointer;
    }

    li:first-of-type {
        color: red;
    }
</style>