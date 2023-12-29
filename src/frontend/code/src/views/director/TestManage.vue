<script setup>
    import Employee from '@/components/Employee.vue'
    import AddAccount from '@/views/director/AddAccount.vue';
    import { ref, onMounted } from 'vue';

    var data = {}
    var render = ref(0);
    const enable_select = true;
    const table = ref(null)
    var curr_page = 0;
    var selectedID = [];

    function deleteAccount(curr_page) {
        selectedID[curr_page] = table.value.getTickedAccounts();
        var deleteID = selectedID[curr_page];
        if(deleteID.length == 0) {
            alert("You did not choose any account to delete");
            return ;
        }
        fetch('http://localhost:8080/account/delete',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': document.cookie
            },
            body: JSON.stringify ({ 
                accountIDs: deleteID
            })
        })
        .then((response) => response.json())
        .then((json) => {
            alert("Deleted successfully");
            curr_page = 0;
            fetch('http://localhost:8080/account/view?page=0',{
                method: 'GET',
                headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': document.cookie,
                        'Cache-control': 'no-cache'
                    },
                })
                .then((response) => response.json())
                .then((json) => {
                    data = json;
                    render.value = render.value + 1
                });
        });
    }

    function nextPage() {
        document.getElementById('prev').disabled = true
        document.getElementById('next').disabled = true
        selectedID[curr_page] = table.value.getTickedAccounts()
        curr_page = curr_page + 1
        fetch('http://localhost:8080/account/view?role=0&page=' + curr_page,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': document.cookie
            },
        })
        .then((response) => response.json())
        .then((json) => {
            if (json['accounts'].length != 0) {
                data = json;
                render.value = render.value + 1
                document.getElementById('prev').disabled = false
                document.getElementById('next').disabled = false
            } else {
                alert('no more data!')
                curr_page -= 1
                if (curr_page != 0) {
                    document.getElementById('prev').disabled = false
                }
            }   
        });
    }

    function previousPage() {
        document.getElementById('prev').disabled = true
        document.getElementById('next').disabled = true
        selectedID[curr_page] = table.value.getTickedAccounts()
        curr_page = curr_page - 1
        fetch('http://localhost:8080/account/view?role=0&page=' + curr_page,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': document.cookie
            },
        })
        .then((response) => response.json())
        .then((json) => {
            data = json;
            render.value = render.value + 1
            if (curr_page != 0) {
                document.getElementById('prev').disabled = false
            }
            document.getElementById('next').disabled = false
        });
    }

    onMounted(()=>{
        fetch('http://localhost:8080/account/view?page=0',{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': document.cookie
            },
        })
        .then((response) => response.json())
        .then((json) => {
            data = json;
            render.value = render.value + 1
        });
    })

    function refresh() {
        fetch('http://localhost:8080/account/view?page=0',{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': document.cookie
            },
        })
        .then((response) => response.json())
        .then((json) => {
            data = json;
            render.value = render.value + 1
        });
    }


    function toggleAddButton() {
        var add = document.getElementById("abc123");
        console.log(add);
        if(add.style.display == "none") {
            add.style.display = "block";
        } else {
            add.style.display = "none";
        }
    }
</script>

<template>
    <h1>Account management</h1>
    <div id="nav">
        <button @click="refresh()"> REFRESH </button>
        <button id="next" @click="nextPage()">NEXT PAGE</button>
        <button disabled id="prev" @click="previousPage()">PREV PAGE</button>
    </div>
    <h2>Current page: {{ curr_page + 1 }}</h2>
    <Employee :key="render.valueOf" ref="table" :data="data['accounts']" :select="enable_select" :selected="selectedID"/><p>
    <div id="operationArea"> 
        <button @click="toggleAddButton">Add an account</button> 
        <button @click="deleteAccount(curr_page)"> Delete ticked account(s) </button>
        <div id="abc123" style="display: none;">
            <AddAccount :key="render.value"/>
        </div> 
    </div>
  </p>

</template>

<style scoped>

    button, #operationArea {
        padding: 5px;
    }

    button + button {
        margin-left: 20px;
    }
    
    #nav {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    #next, #prev {
        float: right;
        margin: 5px
    }

    h1 {
        padding-top: 5px;
        text-align: center;
        font-weight: bold;
    }

    h2 {
        text-align: right;
        padding-bottom: 5px;
        padding-right: 10px;
        font-size: medium;
    }

    #second {
        margin-left: 10px;
    }
</style>