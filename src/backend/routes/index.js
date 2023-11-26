const homeRouter = require('./home')
const directorRouter = require('./director')

function route(app) {
    app.use('/director', directorRouter)
    app.use('/', homeRouter)
}

module.exports = route