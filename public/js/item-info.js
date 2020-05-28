var confirm_message = document.getElementById('confirm-message');
var currItem = {};

function getParams (url) {
    let params = {};
    let parser = document.createElement('a');
    parser.href = url;
    let query = parser.search.substring(1);
    let vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};

function getItemInfo(id){
	let itemName = document.querySelector('.title');
	let displayImage = document.getElementById('item-image');
	let description = document.getElementById('description');
	let price = document.getElementById('price');
	let inStock = document.getElementById('items-in-stock');

	let url = `/itembyid?id=${id}`;
	let settings = {
		method : 'GET',
		headers : {
			'Content-Type' : 'application/json'
		}
	}

	fetch( url, settings )
		.then( response => {
		  if( response.ok ){
		    return response.json();
		  }
		  throw new Error( response.statusText );
		})
		.then( responseJSON => {
			currItem = responseJSON;
			itemName.innerHTML = `<h1>${responseJSON.name}</h1>`;
			displayImage.innerHTML = `<img src="${responseJSON.imageUrl}">`;
			description.innerHTML = responseJSON.description;
			price.innerHTML = `Price: $${responseJSON.price}`;
			inStock.innerHTML = `In stock: ${responseJSON.quantityAvailable}`;
		})
		.catch( err => {
		  console.log(err.message);
		});
}

function addToCart(id, amount){

	let itemAdd = {};

	itemAdd.itemId = id;
	itemAdd.quantity = amount;

	let url = `/updateUserCart/${localStorage.email}`;
	let settings = {
		method : 'PATCH',
		headers : {
			'Content-Type' : 'application/json'
		},
		body : JSON.stringify(itemAdd)
	};

	fetch( url, settings )
		.then( response => {
			console.log(response);
			  	if( response.ok ){
			    	confirm_message.innerHTML = "Item added to cart!";
			  	} else {
			  		throw new Error( response.statusText );
			  	}
			})
		.catch( err => {
		  	confirm_message.innerHTML = err.message;
		});
}

function watchAddToCart(){
	let add_btn = document.getElementById('add-to-cart');
	let quantityBox = document.getElementById('quantity-box');

	add_btn.addEventListener('click', (event) => {
		event.preventDefault();

		if (quantityBox.value > currItem.quantityAvailable)
			confirm_message.innerHTML = "There is not enough available for this item.";
		else if (!localStorage.email)
			confirm_message.innerHTML = "Please sign in to purchase this item.";
		else 
			addToCart(currItem.id, quantityBox.value);
	});
}


function init(){
	getItemInfo(getParams(window.location.href).id);
	watchAddToCart();
}

init();