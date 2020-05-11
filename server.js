const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {Users} = require('./userModel');
const mongoose = require('mongoose');
const cors = require('./middleware/cors');

const app = express();
const jsonParser = bodyParser.json();

app.use( cors );
app.use( express.static( "public" ));
app.use( morgan( 'dev' ) );

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

	if(!email || !password || !fname || !lname || !dob || !sex || admin == null){
		res.statusMessage = "Some parameters are missing.";
		return res.status(406).end();
	}

	newUser = {
		email,
		password,
		fname,
		lname,
		dob,
		sex,
		admin
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