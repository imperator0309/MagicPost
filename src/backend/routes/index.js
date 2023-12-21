const homeRouter = require('./home')
const myRouter = require('./my')
const parcelRouter = require('./parcel')
const baseRouter = require('./base')
const accountRouter = require('./account')
const statisticRouter = require('./statistic')

function route(app) {
    app.use('/my', myRouter)
    app.use('/statistic', statisticRouter)
    app.use('/account', accountRouter)
    app.use('/base', baseRouter)
    app.use('/parcel', parcelRouter)
    app.use('/', homeRouter)
}

module.exports = route