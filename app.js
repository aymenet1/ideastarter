var express = require('express');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var morgan      = require('morgan');
var models = require("./models/models.js");
var api = require("./routes/api.js");

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
app.use('/api', api);

app.get('/',function(req, res){
	res.render("index");
});
models.Sync();
var server = app.listen(3000,"0.0.0.0",function () {
  console.log('app listening at 3000');
});