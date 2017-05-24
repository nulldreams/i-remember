
const express        = require('express')
const app            = express()
const mongoose       = require('mongoose')
const morgan         = require('morgan')
const bodyParser     = require('body-parser')
const methodOverride = require('method-override')



const config = require('./config/db')
mongoose.Promise = global.Promise
mongoose.connect(config.url)

const port = process.env.PORT || 3000
// mongoose.connect(db.url); 

app.set('superSecret', config.secret)
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('X-HTTP-Method-Override'))
app.use(express.static(__dirname + '/public'))

const apiRoutes = express.Router()
require('./app/routes')(app, apiRoutes)

app.listen(port)
console.log('Magic happens on port ' + port)
exports = module.exports = app