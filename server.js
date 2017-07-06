'use strict'

// Defined library
const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');
const connection = require('express-myconnection');
const mysql = require('mysql');

// Express configuration
const app = express();

// Connection to mysql
// const db = require('./db');
app.use(
	connection(mysql, {
		host: 'localhost', 
		user: 'root', 
		password: 'root', 
		port: 3306, 
		database: 'mcoin'
	}, 'request')
);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use the passport package in our application
app.use(passport.initialize());
app.use(passport.session());

// middleware for prevent CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Method', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	next();
});

var router = express.Router();

const userController = require('./controllers/users');

router.route('/users')
	.post(userController.postUser);

router.route('/users/:id')
	.get(userController.getUser)
	.put(userController.updateUser)
	.delete(userController.deleteUser);

router.route('/authenticate')
	.post(userController.postLogin);

// Register all our routes with /api/v1
app.use('/api/v1', router);

// Start the server
app.listen(9000);