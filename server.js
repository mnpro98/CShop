const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const {DATABASE_URL, PORT, SECRET_TOKEN} = require('./config');
const {Items} = require('./models/itemModel');
const {Users} = require('./models/userModel');
const mongoose = require('mongoose');
const cors = require('./middleware/cors');

const app = express();
const jsonParser = bodyParser.json();

app.use( cors );
app.use( express.static( "public" ));
app.use( morgan( 'dev' ) );


app.get('/validate-user', (req, res) => {
	const {sessiontoken} = req.headers;

	jsonwebtoken.verify(sessiontoken, SECRET_TOKEN, (err, decoded) => {
		if(err){
			res.statusMessage = "Your session has expired, log in again.";
			return res.status(400).end();
		}

		return res.status(200).json(decoded);
	});
});

app.post('/users/login', jsonParser, (req, res) => {
	let {email, password} = req.body;

	if(!email || !password){
		res.statusMessage = "Parameter missing in the body of the request.";
		return res.status(406).end();
	}

	Users
		.getUser(email)
		.then(user => {
			console.log(user);
			if(user){
				bcrypt.compare(password, user.password)
					.then(result => {
						if(result){
							let userData = {
								fname : user.fname,
								lname : user.lname,
								email : user.email,
								purchasedItems : user.purchasedItems,
								cart : user.cart,
								admin : user.admin
							}

							jsonwebtoken.sign(userData, SECRET_TOKEN, {expiresIn : '30m'}, (err, token) => {
								if(err){
									res.statusMessage = "Something went wrong generating the token.";
									return res.status(400).end();
								}
								return res.status(200).json({token});
							});
						}
						else {
							res.statusMessage = "wrong credentials provided.";
							return res.status(409).end();
						}
					})
					.catch(err => {
						res.statusMessage = err.message;
						return res.status(400).end();
					});
		}
		else{
			throw new Error("User does not exist!");
		}
	})
	.catch(err => {
		res.statusMessage = err.message;
		return res.status(400).end()
	});
});

app.get('/users', (req, res) => {
	console.log("Getting all users.");

	Users
		.getAllUsers()
		.then(result => {
			return res.status(200).json(result);
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).end();
		});
});

app.get('/items', (req, res) => {
	console.log("Getting all items.");

	Items
		.getAllItems()
		.then(result => {
			return res.status(200).json(result);
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).end();
		});
});

app.get('/user', (req, res) => {
	console.log("Getting user.");

	let email = req.query.email;

	if(email == undefined){
		res.statusMessage = "Email not received";
		return res.status(406).end();
	} else {
		Users
			.getUser(email)
			.then(result => {
				if(result != ""){
					return res.status(200).json(result);
				} else {
					res.statusMessage = "Incorrect email or password.";
					return res.status(404).end();
				}
			})
			.catch(err => {
				res.statusMessage = "Something went wrong with the DB. Try again later.";
				return res.status(500).end();
			});
	}
});

app.get('/itembyid', (req, res) => {
	console.log("Getting item.");

	let id = req.query.id;

	if(id == undefined){
		res.statusMessage = "Id not received";
		return res.status(406).end();
	} else {
		Items
			.getItem(id)
			.then(result => {
				if(result != ""){
					return res.status(200).json(result);
				} else {
					res.statusMessage = "Id does not exist.";
					return res.status(404).end();
				}
			})
			.catch(err => {
				res.statusMessage = "Something went wrong with the DB. Try again later.";
				return res.status(500).end();
			});
	}
});

app.get('/item-info.html/:id', (req, res) => {
	var itemId = req.params.id;
	console.log(itemId);
	res.render('item-info.html', {id:itemId});
});

app.get('/itembyname', (req, res) => {
	console.log("Getting items.");

	let name = req.query.name;

	if(name == undefined){
		res.statusMessage = "Name not received";
		return res.status(406).end();
	} else {
		Items
			.getItemName(name)
			.then(result => {
				if(result != ""){
					return res.status(200).json(result);
				} else {
					res.statusMessage = "No items found with that search term.";
					return res.status(404).end();
				}
			})
			.catch(err => {
				res.statusMessage = "Something went wrong with the DB. Try again later.";
				return res.status(500).end();
			});
	}
});

app.post('/createuser', jsonParser, (req, res) => {
	console.log("Creating user.");
	console.log("Body ", req.body);

	let email = req.body.email;
	let password = req.body.password;
	let fname = req.body.fname;
	let lname = req.body.lname;
	let dob = req.body.dob;
	let sex = req.body.sex;
	let admin = req.body.admin;
	let purchasedItems = [];
	let cart = [];

	if(!email || !password || !fname || !lname || !dob || !sex || admin == null){
		res.statusMessage = "Some parameters are missing.";
		return res.status(406).end();
	}

	bcrypt.hash(password, 10)
		.then(hashedPassword => {
			let newUser = {
				email,
				password : hashedPassword,
				fname,
				lname,
				dob,
				sex,
				admin,
				purchasedItems,
				cart
			};

			Users
				.createUser(newUser)
				.then(result => {
					return res.status(201).json(result);
				})
				.catch(err => {
					res.statusMessage = "Something went wrong with the DB. Try again later.";
					return res.status(500).end();
				});
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).end();
		});

});

app.post('/createitem', jsonParser, (req, res) => {
	console.log("Creating item.");
	console.log("Body ", req.body);

	let id = uuid.v4();
	let name = req.body.name;
	let description = req.body.description;
	let price = req.body.price;
	let quantityAvailable = req.body.quantityAvailable;
	let imageUrl = req.body.imageUrl;


	if(!id || !name || !description || !price || !quantityAvailable || !imageUrl){
		res.statusMessage = "Some parameters are missing.";
		return res.status(406).end();
	}

	newItem = {
		id,
		name,
		description,
		price,
		quantityAvailable,
		imageUrl
	};

	Items
		.createItem(newItem)
		.then(result => {
			return res.status(201).json(result);
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).end();
		});
});

app.delete('/user/:email', (req, res) => {
	
	let email = req.params.email;

	if(!email){
		res.statusMessage = "Please send the 'email' to delete a user";
		return res.status(406).end();
	}

	Users
		.deleteUser(email)
		.then(result => {
			if(result.deletedCount != 0){
				return res.status(200).end();
			} else {
				res.statusMessage = `User with email: ${email} not found`;
				return res.status(404).end();
			}
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).end();
		});
});


app.listen(8080, () => {
	console.log("This server is running on port 8080");

	new Promise(( resolve, reject) => {
		mongoose.connect('mongodb://localhost/cshopdb', {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
			if(err){
				reject(err);
			}
			else{
				console.log("cshopdb connected successfully");
				return resolve();
			}
		})
	})
	.catch(err => {
		mongoose.disconnect();
		console.log(err);
	});
});


//'mongodb://localhost/bookmarksdb'