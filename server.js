const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const path = require('path');
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

app.patch('/updateUserCart/:email', jsonParser, async(req, res) => {
	
	let email = req.params.email;

	//console.log("Body ", req.body);

	let itemToAdd = { 
		itemId: req.body.itemId, 
		quantity: req.body.quantity
	};

	if(!email){
		res.statusMessage = "Please send the 'email' to update cart.";
		return res.status(406).end();
	}

	if(!itemToAdd){
		res.statusMessage = "No parameters were sent to update.";
		return res.status(406).end();
	}

	await Users
		.pushToCart(email, itemToAdd)
		.then(result => {
			if(result.n == 0){
				res.statusMessage = "Could not find email.";
				return res.status(404).end();
			} else {
				res.statusMessage = "Update successful";
				return res.status(202).end();
			}
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).end();
		});

});


app.patch('/cartToHistory/:email', jsonParser, async(req, res) => {
	
	let email = req.params.email;

	let itemsToAdd = req.body;

	if(!email){
		res.statusMessage = "Please send the 'email' to update cart.";
		return res.status(406).end();
	}

	if(!itemsToAdd){
		res.statusMessage = "No parameters were sent to update.";
		return res.status(406).end();
	}

	await Users
		.cartToHistory(email, itemsToAdd)
		.then(result => {
			if(result.n == 0){
				res.statusMessage = "Could not find email.";
				return res.status(404).end();
			} else {
				res.statusMessage = "Update successful";
				return res.status(202).end();
			}
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).end();
		});

});


app.patch('/deleteFromCart/:email', jsonParser, async(req, res) => {
	
	let email = req.params.email;

	let itemToDelete = req.body.itemId;

	//console.log("Body ", req.body);

	if(!email){
		res.statusMessage = "Please send the 'email' to update cart.";
		return res.status(406).end();
	}

	if(!itemToDelete){
		res.statusMessage = "No id was sent to delete.";
		return res.status(406).end();
	}

	await Users
		.deleteFromCart(email, itemToDelete)
		.then(result => {
			if(result.n == 0){
				res.statusMessage = "Could not find email.";
				return res.status(404).end();
			} else {
				res.statusMessage = "Update successful";
				return res.status(202).end();
			}
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).end();
		});

});

app.patch('/deleteHistory/:email', jsonParser, async(req, res) => {
	
	let email = req.params.email;

	//console.log("Body ", req.body);

	if(!email){
		res.statusMessage = "Please send the 'email' to update cart.";
		return res.status(406).end();
	}

	await Users
		.deleteHistory(email)
		.then(result => {
			if(result.n == 0){
				res.statusMessage = "Could not find email.";
				return res.status(404).end();
			} else {
				res.statusMessage = "Update successful";
				return res.status(202).end();
			}
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).end();
		});

});

app.patch('/deleteCart/:email', jsonParser, async(req, res) => {
	
	let email = req.params.email;

	//console.log("Body ", req.body);

	if(!email){
		res.statusMessage = "Please send the 'email' to update cart.";
		return res.status(406).end();
	}

	await Users
		.deleteCart(email)
		.then(result => {
			if(result.n == 0){
				res.statusMessage = "Could not find email.";
				return res.status(404).end();
			} else {
				res.statusMessage = "Update successful";
				return res.status(202).end();
			}
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).end();
		});

});

app.patch('/changePrice/:id', jsonParser, async(req, res) => {
	
	let id = req.params.id;

	let newPrice = req.body.price;

	//console.log("Body ", req.body);

	if(!id){
		res.statusMessage = "Please send the 'id' to update the price.";
		return res.status(406).end();
	}

	await Items
		.patchItem(id, {"price" : newPrice})
		.then(result => {
			if(result.n == 0){
				res.statusMessage = "Could not find id.";
				return res.status(404).end();
			} else {
				res.statusMessage = "Update successful";
				return res.status(202).end();
			}
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

app.delete('/deleteItem/:id', (req, res) => {
	
	let id = req.params.id;

	if(!id){
		res.statusMessage = "Please send the 'id' to delete an item";
		return res.status(406).end();
	}

	Items
		.deleteItem(id)
		.then(result => {
			if(result.deletedCount != 0){
				return res.status(200).end();
			} else {
				res.statusMessage = `Item with id: ${email} not found`;
				return res.status(404).end();
			}
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).end();
		});
});


app.listen(PORT, () => {
	console.log("This server is running on port 8080");

	new Promise(( resolve, reject) => {
		mongoose.connect(DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
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