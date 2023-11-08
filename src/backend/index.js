const express = require('express')
const path = require('path')
const db = require('./config/db')
const cors = require('cors')

const route = require('./routes')

const app = express()
const port = 80

app.use(cors())
app.use(express.static(path.join(__dirname, '../frontend/public')))

app.use(express.urlencoded({
    extended: true,
}))

app.use(express.json())

db.connect()

//routes init
route(app)

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))


