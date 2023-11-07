const express = require('express')
const path = require('path')
const handlebars = require('express-handlebars')
const db = require('./config/db')
const route = require('./routes')

const app = express()
const port = 80


app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({
    extended: true,
}))

app.use(express.json())

//template engine
app.engine('hbs', handlebars.create({
    extname: ".hbs",
}).engine)

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/resources/views'));

db.connect()

app.get('/', (req, res) => {
    res.render('home')
})

//routes init
route(app)

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))


