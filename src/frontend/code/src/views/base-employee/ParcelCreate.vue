<script setup>
    function create_parcel() {
        var s_name = document.getElementById('s_name').value
        var s_phone = document.getElementById('s_phone').value
        var s_address = document.getElementById('s_address').value
        var r_name = document.getElementById('r_name').value
        var r_phone = document.getElementById('r_phone').value
        var r_address = document.getElementById('r_address').value
        var p_weight = document.getElementById('p_weight').value
        var p_price = document.getElementById('p_price').value

        if (s_name == '') {
            alert('Please enter sender name!')
            return
        }
        if (s_phone == '') {
            alert('Please enter sender phone number!')
            return
        }
        if (s_address == '') {
            alert('Please enter sender address!')
            return
        }
        if (r_name == '') {
            alert('Please enter receiver name!')
            return
        }
        if (r_phone == '') {
            alert('Please enter receiver phone number!')
            return
        }
        if (r_address == '') {
            alert('Please enter receiver address!')
            return
        }
        if (p_weight == '') {
            alert('Please enter parcel weight')
            return
        }
        if (p_price == '') {
            alert('Please enter delivering price')
            return
        }
        if (s_phone.length != 10 || r_phone.length != 10) {
            alert('Invalide phone number. Phone number must contains 10 digits' + s_phone.length + r_phone.length)
            return
        }
        if (r_name.length < 2) {
            alert('receiver name is too short!')
            return
        }
        if (s_name.length < 2) {
            alert('sender name is too short!')
            return
        }

        var raw_json = JSON.stringify(
            {
                sentFrom: s_address,
                sentTo: r_address,
                senderName: s_name,
                senderPhone: s_phone,
                receiverName: r_name,
                receiverPhone: r_phone,
                weight: p_weight,
                price: p_price
            }
        )
        
        fetch('http://localhost:8080/parcel/create', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("jwt"),
                'Cache-control': 'no-cache'
            },
            body: JSON.stringify({
                parcelData: {
                    sentFrom: s_address,
                    sentTo: r_address,
                    senderName: s_name,
                    senderPhone: s_phone,
                    receiverName: r_name,
                    receiverPhone: r_phone,
                    weight: p_weight,
                    price: p_price
                }
            })
        })
        .then(response => {
            if(response['status'] == '200') {
                alert('Parcel submitted succesfully!')
                document.getElementById('form').reset()
            } else {
                alert('Error: ' + response['statusText'])
            }
        })
    }
</script>

<template>
    <h1>SUBMIT NEW PARCEL</h1>
    <form id="form">
        <div class="col">
            <h2>Sender details</h2>
            <div class="form_group">
                <label name="s_name">Sender Full Name</label>
                <input id="s_name" name="s_name" placeholder="Sender name">
            </div>
            <div class="form_group">
                <label name="s_phone">Sender Phone Number</label>
                <input id="s_phone" name="s_phone" maxlength="10" placeholder="Sender phone number">
            </div>
            <div class="form_group">
                <label name="s_address">Sender Address</label>
                <input id="s_address" name="s_address" placeholder="Sender address">
            </div>
        </div>
        <div class="col">
            <h2>Receiver details</h2>
            <div class="form_group">
                <label name="r_name">Receiver Name</label>
                <input id="r_name" name="r_name" placeholder="Receiver name">
            </div>
            <div class="form_group">
                <label name="r_phone">Receiver Phone Number</label>
                <input id="r_phone" name="r_phone" maxlength="10" placeholder="Receiver phone number">
            </div>
            <div class="form_group">
                <label name="r_address">Receiver Address</label>
                <input id="r_address" name="r_address" placeholder="Receiver address">
            </div>
            <br>
            <h2>parcel details</h2>
            <div class="form_group">
                <label name="p_weight">Parcel weight</label>
                <input id="p_weight" name="p_weight" placeholder="Parcel weight">
            </div>
            <div class="form_group">
                <label name="p_price">Delivering cost</label>
                <input id="p_price" name="p_price" placeholder="Delivering cost">
            </div>
        </div>
    </form>
    <button type="submit" id="submit" @click="create_parcel()">SUBMIT PARCELS</button>
</template>

<style scoped>
h1 {
    text-align: center;
    margin-top: 2%;
    margin-bottom: 2%;
}

h2 {
    text-align: center;
}

form {
    display: flex;
    width: 100%;
}
.col {
    flex: 1
}
.form_group {
    width: 90%;
    margin: auto;
    padding: 10px;
}

label {
    text-align: left;
    font-size: large;
}

input {
    float: right;
    clear: left;
    height: 100%;
    width: 50%;
}

#submit {
    float: right;
    width: 20%;
    height: 10%;
    margin-right: 5%;
    margin-top: 3%;
    font-size: x-large;
    font-weight: bold;
}
</style>