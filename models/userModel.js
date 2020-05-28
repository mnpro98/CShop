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
	},
	purchasedItems : [{
		itemId: {type: String},
		quantity: {type: Number}
	}],
	cart : [{
		itemId: {type: String},
		quantity: {type: Number}
	}]
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
			.populate('purchasedItems')
			.then(allUsers => {
				return allUsers;
			})
			.catch(err => {
				return err;
			});
	},
	getUser : function(emailsearch){
		return usersCollection
				.findOne({email: `${emailsearch}`})
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
	patchUser : function (emailsearch, updateQuery){
		return usersCollection
				.updateOne({email: emailsearch}, { $set : updateQuery })
				.then(updatedUser => {
					return updatedUser;
				})
				.catch(err => {
					return err;
				});
	},
	pushToCart : function (emailsearch, item){
		return usersCollection
				.updateOne({email: emailsearch}, { $push : {cart: item} })
				.then(updatedUser => {
					return updatedUser;
				})
				.catch(err => {
					return err;
				});
	},
	deleteFromCart : function (emailsearch, id){
		return usersCollection
				.updateOne({email: emailsearch}, { $pull : { cart: {itemId : id} } })
				.then(updatedUser => {
					return updatedUser;
				})
				.catch(err => {
					return err;
				});
	},
	pushToHistory : function (emailsearch, updateQuery){
		return usersCollection
				.updateOne({email: emailsearch}, { $push : {purchasedItems: item} })
				.then(updatedUser => {
					return updatedUser;
				})
				.catch(err => {
					return err;
				});
	}
};

module.exports = {Users};