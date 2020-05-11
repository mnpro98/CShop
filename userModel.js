const mongoose = require('mongoose');

const userCollectionSchema = mongoose.Schema({
	email : {
		type : String,
		required : true,
		unique : true
	},
	password : {
		type : String,
		required : true
	},
	fname : {
		type : String,
		required : true
	},
	lname : {
		type : String,
		required : true
	},
	dob : {
		type : Date,
		required : true
	},
	sex : {
		type : String,
		required : true
	},
	admin : {
		type : Boolean,
		required : true
	}
});

const usersCollection = mongoose.model('users', userCollectionSchema);

const Users = {
	createUser : function(newUser){
		return usersCollection
			.create(newUser)
			.then(createdUser => {
				return createdUser;
			})
			.catch(err => {
				return err;
			});
	},
	getAllUsers : function(){
		return usersCollection
			.find()
			.then(allUsers => {
				return allUsers;
			})
			.catch(err => {
				return err;
			});
	},
	getUser : function(emailsearch){
		return usersCollection
				.find({email: `${emailsearch}`})
				.then(foundUser => {
					return foundUser;
				})
				.catch(err => {
					return err;
				});
	},
	deleteUser : function(emailsearch){
		return usersCollection
				.deleteOne({email: `${emailsearch}`})
				.then(deletedUser => {
					return deletedUser;
				})
				.catch(err => {
					return err;
				});
	},
	patchUser : function (idsearch, updateQuery){
		return usersCollection
				.updateOne({_id: idsearch}, { $set : updateQuery })
				.then(updatedUser => {
					return updatedUser;
				})
				.catch(err => {
					return err;
				});
	}
};

module.exports = {Users};