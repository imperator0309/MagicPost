<template>
    <h2>Type account information here:</h2>
    <div class="addaccount">
        <form>
        <div>
            <label for="fname">Full name</label>
            <input type="text" id="fname" name="fname">
        </div>
        <div>
            <label for="addr">Address</label>
            <input type="text" id="addr" name="addr">
        </div>
        <div>
            <label for="">Sex</label>
            <input type="radio" name="gioitinh" value="1"> Nam 
            <input style="margin-right: auto;" type="radio" name="gioitinh" value="0"> Nữ 
        </div>
        <div>
            <label for="age">Age</label>
            <input type="text" id="age" name="age">
        </div>
        <div>
            <label for="email">Email</label>
            <input type="text" id="email" name="email">
        </div>
        <div>
            <label for="phone">Phone</label>
            <input type="text" id="phone" name="phone">
        </div>
        <div>
            <label>Course</label>
            <input type="checkbox" name="course1" id="course1" value="course1">
            <label for="course1">English</label>
            <input type="checkbox" name="course2" id="course2" value="course2">
            <label for="course2">Business</label>
            <input type="checkbox" name="course3" id="course3" value="course3">
            <label for="course3">IT</label>
        </div>
        <div>
            <label for="username">User Name</label>
            <input type="text" id="username" name="username">
        </div>
        <div>
            <label for="pass">Password</label>
            <input type="text" id="pass" name="pass">
        </div>
        <div>
            <label for="repass">Re-password</label>
            <input type="text" id="repass" name="repass">
        </div>
        <div>
            <label for="addr">Comment</label>
            <textarea name="Comment" cols="20" rows="5"> </textarea>
        </div>
        <div>
            <input type="button" value="Submit">
            <input style="margin-left: auto;" type="reset" value="Reset">
        </div>
    </form>
    </div>
</template>

<style scoped>
    form {
        width: 1200px;
        margin: auto;
        border: solid;
    }
    div {
        padding: 10px;
        display: flex;
    }
    label {
        text-align: left;
        flex-grow: 1;
    }
    h1 {
        text-align: center;
    }
</style>