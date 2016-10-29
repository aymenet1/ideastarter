var express = require('express');
var session = require('express-session')
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var morgan      = require('morgan');
var models = require("./models/models.js");
var api = require("./routes/api.js");
var cookieParser = require('cookie-parser')
app.locals.moment = require('moment');
var createurideeRoute = require("./routes/createurideeRoute.js");
var createurideePreLoginRoute = require("./routes/createurideePreLoginRoute.js");
var PreLoginRoute = require("./routes/PreLoginRoute.js");
var adminRoute = require("./routes/adminRoute.js");
app.use(session({secret: '1234567890QWERTY'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/uploads',express.static(__dirname + '/uploads'));
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use('/createuridee', express.static('public'));
app.use('/admin', express.static('/public'));
app.use('/createuridee/chercher', express.static('public'));
app.use('/createuridee/chercher/categorie', express.static('public'));

app.use(morgan('dev'));
app.use('/api', api);

app.use('/',PreLoginRoute);
app.use('/', createurideePreLoginRoute);
app.use('/createuridee', createurideeRoute);
app.use('/admin', adminRoute);

app.get('/',function(req, res){
	res.render("index");
});

models.Sync();
var server = app.listen(3000,"0.0.0.0",function () {
  console.log('app listening at 3000');
});