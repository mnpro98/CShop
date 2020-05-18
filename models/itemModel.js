const mongoose = require('mongoose');

const itemCollectionSchema = mongoose.Schema({
	id : {
		type : String,
		required : true,
		unique : true
	},
	name : {
		type : String,
		required : true
	},
	description : {
		type : String,
		required : true
	},
	price : {
		type : Number,
		required : true
	},
	quantityAvailable : {
		type : Number,
		required : true
	},
	imageUrl : {
		type : String,
		required : true
	}
});

const itemsCollection = mongoose.model('items', itemCollectionSchema);

const Items = {
	createItem : function(newItem){
		return itemsCollection
			.create(newItem)
			.then(createdItem => {
				return createdItem;
			})
			.catch(err => {
				return err;
			});
	},
	getAllItems : function(){
		return itemsCollection
			.find()
			.then(allItems => {
				return allItems;
			})
			.catch(err => {
				return err;
			});
	},
	getItem : function(idsearch){
		return itemsCollection
				.find({id: `${idsearch}`})
				.then(foundItem => {
					return foundItem;
				})
				.catch(err => {
					return err;
				});
	},
	getItemName : function(namesearch){
		return itemsCollection
				.find({name: `${namesearch}`})
				.then(foundItems => {
					return foundItems;
				})
				.catch(err => {
					return err;
				});
	},
	deleteItem : function(idsearch){
		return itemsCollection
				.deleteOne({id: `${idsearch}`})
				.then(deletedItem => {
					return deletedItem;
				})
				.catch(err => {
					return err;
				});
	},
	patchItem : function (idsearch, updateQuery){
		return itemsCollection
				.updateOne({id: idsearch}, { $set : updateQuery })
				.then(updatedItem => {
					return updatedItem;
				})
				.catch(err => {
					return err;
				});
	}
};

module.exports = {Items};