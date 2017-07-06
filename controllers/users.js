var User = require('../models/users');
const multer = require('multer');
const jwt = require('jsonwebtoken');

exports.postUser = function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	var fullname = req.body.fullname;
	var birth_date = req.body.birth_date;
	// Skip photo upload at the moment
	// var photo = req.body.photo;
	// var now = Date.now();

	// var storage = multer.diskStorage({
	// 	destination: function(req, file, cb) {
	// 		cb(null, __dirname + '/images');
	// 	}, 
	// 	filename: function(req, file, cb) {
	// 		var ext = file.originalname.split('.');
	// 		ext = ext[ext.length - 1];
	// 		cb(null, 'uploads-' + now + '.' + ext);
	// 	}
	// });

	// var upload = multer({
	// 	storage: storage
	// }).single('upload');

	// upload(function(req, res, err) {
	// 	if(err) {
	// 		res.json({
	// 			status: 'ERROR', 
	// 			message: err
	// 		});
	// 	}
	// });

	req.getConnection(function(err, connection) {
		var data = {
			email: email, 
			password: password, 
			fullname: fullname, 
			birth_date: new Date(birth_date)
		};

		// Check if email exist
		connection.query('SELECT * FROM `users` WHERE email = ?', [email], function(err, user) {
			if(err) {
				return res.json({
					status: 'ERROR', 
					message: err
				});
			}
			
			if(!user.length) {
				connection.query('INSERT INTO `users` SET ?', data, function(error, newUser) {
					if(err) {
						return res.json({
							status: 'ERROR', 
							message: err
						});
					}

					return res.json({
						status: 'OK', 
						message: 'User successfully registered'
					});
				});
			}
			else {
				return res.json({
					status: 'ERROR', 
					message: 'User already exist'
				});
			}
		});
	});
};

exports.getUser = function(req, res) {
	var id = req.params.id;

	if(!id) {
		return res.json({
			status: 'ERROR', 
			message: 'User does not exist'
		});
	}

	req.getConnection(function(err, connection) {
		connection.query('SELECT * FROM `users` WHERE id = ?', [id], function(err, user) {
			if(err) {
				return res.json({
					status: 'ERROR', 
					message: err
				});
			}

			if(!user.length) {
				return res.json({
					status: 'ERROR', 
					message: 'User does not exist'
				});
			}
			else {
				return res.json({
					status: 'OK', 
					data: user
				});
			}
		});
	});
};

exports.updateUser = function(req, res) {
	var id = req.params.id;

	if(!id) {
		return res.json({
			status: 'ERROR', 
			message: 'User does not exist'
		});
	}

	req.getConnection(function(err, connection) {
		var data = {
			email: req.body.email, 
			password: req.body.password, 
			fullname: req.body.fullname, 
			birth_date: new Date(req.body.birth_date)
		};

		connection.query('SELECT * FROM `users` WHERE id = ?', [id], function(err, user) {
			if(err) {
				return res.json({
					status: 'ERROR', 
					message: err
				});
			}
			if(!user.length) {
				return res.json({
					status: 'ERROR', 
					message: 'User does not exist'
				});
			}
			else {
				connection.query('UPDATE `users` SET ? WHERE id = ?', [data, id], function(err, user) {
					if(err) {
						return res.json({
							status: 'ERROR', 
							message: err
						});
					}			
					else {
						return res.json({
							status: 'OK', 
							message: 'User successfully update'
						});
					}
				});
			}
		});
	});
};

exports.deleteUser = function(req, res) {
	var id = req.params.id;

	if(!id) {
		return res.json({
			status: 'ERROR', 
			message: 'User does not exist'
		});
	}

	req.getConnection(function(err, connection) {
		connection.query('SELECT * FROM `users` WHERE id = ?', [id], function(err, user) {
			if(err) {
				return res.json({
					status: 'ERROR', 
					message: err
				});
			}
			if(!user.length) {
				return res.json({
					status: 'ERROR', 
					message: 'User does not exist'
				});
			}
			else {
				connection.query('DELETE FROM `users` WHERE id = ? ', [id], function(err, user) {
					if(err) {
						return res.json({
							status: 'ERROR', 
							message: err
						});
					}
					else {
						return res.json({
							status: 'OK', 
							message: 'User successfully deleted'
						});
					}
				});
			}
		});
	});
};

exports.postLogin = function(req, res) {
	var email = req.body.email;
	var password = req.body.password;

	if(!email || !password) {
		return res.json({
			status: 'ERROR', 
			message: 'Invalid username or password'
		});
	}

	req.getConnection(function(err, connection) {
		connection.query('SELECT * FROM `users` WHERE email = ? AND password = ?', [email, password], function(err, user) {
			if(err) {
				return res.json({
					status: 'ERROR', 
					message: err
				});
			}

			if(!user.length) {
				return res.json({
					status: 'ERROR', 
					message: 'Invalid username or password'
				});
			}
			else {
				var secret = 'super secret whatever you want';
				var token = jwt.sign({user}, secret);
				return res.json({
					status: 'OK', 
					token: token
				})
			}
		});
	});
};