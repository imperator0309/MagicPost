const mysql = require('mysql2')

const connect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'magic_post'
});

connect.connect(function(err) {
    if (err) {
        console.log('Connect failed!', err)
    }
})

module.exports = connect

