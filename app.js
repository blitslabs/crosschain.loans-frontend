require('dotenv').config()
const cors = require('cors')
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')

const fileUpload = require('express-fileupload')

const cookieParser = require('cookie-parser')

const routesAdmin = require('./app_server/routes/index')
const routesApi = require('./app_api/routes/index')
const app = express()

app.use(cors({ origin: '*', credentials: false, origin: process.env.API_WALLET }))
app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 } }))

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(express.static(path.join(__dirname, 'public')))


app.use('/api', routesApi)
// csrf and cookies
app.use(cookieParser())
// app.use(csurf({cookie: {httpOnly: true}}))
app.use('/', routesAdmin)

// global variable
global.APP_ROOT = path.resolve(__dirname)

// Cronjobs
const { CronJob } = require('cron')
const rp = require('request-promise')

const matching_engine = new CronJob('*/30 * * * * *', async function () {
    await rp(process.env.API_LOCALHOST + 'engine/match/pending')
    console.log('Matching Engine Activated...')
})

const oracle_testnet = new CronJob('0 * * * *', async function () {
    await rp(process.env.API_LOCALHOST + 'oracle/ONE/testnet')
    console.log('Testnet Oracle prices updated...')
})

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401)
        res.json({ status: 'ERROR', message: 'Unauthorized user' })
    } else if (err.code === 'EBADCSRFTOKEN') {
        res.status(403)
        res.send('CSRF verification failed')
    } else if (err.message === 'missing_token_cookie') {
        res.status(401)
        res.json({ status: 'ERROR', message: 'User not authenticated' })
        res.end()
    }
})

app.set('port', process.env.PORT || 3000)
app.listen(app.get('port'), function() {
    console.log('Listening on port ' + app.get('port'))
    // matching_engine.start()
    // oracle_testnet.start()
})

module.exports = app