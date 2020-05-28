
let editPriceButtons = [];
let removeItemButtons = [];
let itemArr = [];

function changePrice(){

	for(let i = 0; i < editPriceButtons.length; i++) {
		document.getElementById('edit-price-' + i).addEventListener('click', (event) => {
			event.preventDefault();

			let priceBox = document.getElementById('new-price-box-' + i);
			let priceLabel = document.getElementById('price-' + i);

			let priceObj = {};

			priceObj.price = priceBox.value;

			let priceUrl = `/changePrice/${itemArr[i].id}`;
			let priceSettings = {
				method : 'PATCH',
				headers : {
					'Content-Type' : 'application/json'
				},
				body : JSON.stringify(priceObj)
			};

			fetch( priceUrl, priceSettings )
				.then( response => {
					if( response.ok ){
						return response.json();
					}
					throw new Error( response.statusText );
				})
				.then( responseJSON => {
					priceLabel.innerHTML = `Price: $${priceObj.price}`;
				})
				.catch( err => {
					priceLabel.innerHTML = `Price: $${priceObj.price}`;
				});
		});
	}
}

function removeItems(){

	for(let i = 0; i < removeItemButtons.length; i++) {
		document.getElementById('remove-' + i).addEventListener('click', (event) => {
			event.preventDefault();

			let url = `/deleteItem/${itemArr[i].id}`;
			let settings = {
				method : 'DELETE',
				headers : {
					'Content-Type' : 'application/json'
				}
			};

			fetch( url, settings )
				.then( response => {
					if( response.ok ){
						return response.json();
					}
					throw new Error( response.statusText );
				})
				.then( responseJSON => {
					event.currentTarget.parentNode.parentNode.parentNode.removeChild(event.currentTarget.parentNode.parentNode);
				})
				.catch( err => {
					event.currentTarget.parentNode.parentNode.parentNode.removeChild(event.currentTarget.parentNode.parentNode);
				});
		});
	}
}

function getItems(){
	let itemDisplay = document.getElementById('items-in-item-list');

	let url = '/items';
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
			
			for(let i = 0; i < responseJSON.length; i++){
				itemDisplay.innerHTML += `
				<div class="item-in-item-list" id = "item-${i}">
					<div>
						<img src="${responseJSON[i].imageUrl}">
					</div>
					<div>
						<h2>${responseJSON[i].name}</h2>
						<h3>Available: ${responseJSON[i].quantityAvailable}</h3>
						<button class="remove-item" id="remove-${i}">Remove item</button>
						<button class="change-availability">Change amount available</button>
					</div>
					<div>
						<h3 id = "price-${i}">Price: $${responseJSON[i].price}</h3>
						<button class="edit-price" id = "edit-price-${i}">Edit price</button></br>
						<input type="text" id="new-price-box-${i}">
					</div>
				</div>`;

				editPriceButtons.push(document.getElementById(`edit-price-${i}`));
				removeItemButtons.push(document.getElementById(`remove-${i}`));
				itemArr.push(responseJSON[i]);
			}
			changePrice();
			removeItems();
		})
		.catch( err => {
			statusMessage.innerHTML = `${err.message}`;
		});
}

function addItemButton(){
	let addButton = document.getElementById('add-item');

	addButton.addEventListener('click', (event) => {
		event.preventDefault();

		document.location.href = "./add-item.html";
	});
}

function signOut(){
	let signOutBtn = document.getElementById('sign-out');

	signOutBtn.addEventListener('click', (event) => {
		event.preventDefault();

		document.location.href = "./login.html";
	});
}

function init(){
	getItems();
	addItemButton();
	signOut();
}


init();