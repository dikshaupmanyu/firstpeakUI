// server.js

// set up ======================================================================
// get all the tools we need
var compression = require('compression')
var express  = require('express');
var app      = express();
var fs      = require('fs');

// var port     = process.env.PORT || 5555;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path = require('path');
var responseTime = require('response-time');
var redis = require('redis');
var cors = require('cors');
var request = require('request');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var Base64 = require('Base64');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

require('./config/passport')(passport); // pass passport for configuration

app.configure(function() {

	// set up our express application
	app.use(compression());
	app.use(cors());
	app.use(responseTime());
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(express.static(path.join(__dirname, 'public')));
	// app.use(express.static(path.join(__dirname, '/opt/s')));
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
	app.use((req, res, next) => {
	  res.header('Access-Control-Allow-Origin', '*');
	  next();
	});

});

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
// app.listen(port);
//var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

//httpServer.listen(5555);
httpsServer.listen(5555);

console.log('The magic happens on port ');
