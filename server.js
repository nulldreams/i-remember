
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
const morgan       = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');



var db = require('./config/db');

mongoose.connect(db.url);

var port = process.env.PORT || 3000; 
// mongoose.connect(db.url); 


app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));


require('./app/routes')(app);

app.listen(port);	
console.log('Magic happens on port ' + port);
exports = module.exports = app;