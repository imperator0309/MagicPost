<script setup>
</script>

<template>
    <h1>SUBMIT NEW PARCEL</h1>
    <form>
        <div class="col">
            <h2>Sender details</h2>
            <div class="form_group">
                <label name="s_name">Sender Full Name</label>
                <input id="s_name" name="s_name" placeholder="Sender name">
            </div>
            <div class="form_group">
                <label name="s_phone">Sender Phone Number</label>
                <input id="s_phone" name="s_phone" placeholder="Sender phone number">
            </div>
            <div class="form_group">
                <label name="s_phone">Sender Phone Number</label>
                <input id="s_phone" name="s_phone" placeholder="Sender phone number">
            </div>
            <div class="form_group">
                <label name="s_phone">Sender Phone Number</label>
                <input id="s_phone" name="s_phone" placeholder="Sender phone number">
            </div>
        </div>
        <div class="col">
            <h2>Receiver details</h2>
            <div class="form_group">
                <label name="s_phone">Sender Phone Number</label>
                <input id="s_phone" name="s_phone" placeholder="Sender phone number">
            </div>
            <div class="form_group">
                <label name="s_phone">Sender Phone Number</label>
                <input id="s_phone" name="s_phone" placeholder="Sender phone number">
            </div>
            <div class="form_group">
                <label name="s_phone">Sender Phone Number</label>
                <input id="s_phone" name="s_phone" placeholder="Sender phone number">
            </div>
            <br>
            <h2>parcel details</h2>
            <div class="form_group">
                <label name="s_phone">Sender Phone Number</label>
                <input id="s_phone" name="s_phone" placeholder="Sender phone number">
            </div>
            <div class="form_group">
                <label name="s_phone">Sender Phone Number</label>
                <input id="s_phone" name="s_phone" placeholder="Sender phone number">
            </div>
        </div>
    </form>
    <button type="submit" id="submit">SUBMIT PARCELS</button>
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
    width: 80%;
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