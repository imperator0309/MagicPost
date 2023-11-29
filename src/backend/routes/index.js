const homeRouter = require('./home')
const directorRouter = require('./director')
const managerRouter = require('./manager')

function route(app) {
    app.use('/director', directorRouter)
    app.use('/manager', managerRouter)
    app.use('/', homeRouter)
}

module.exports = route