
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
				<div class="item-in-item-list">
					<div>
						<img src="${responseJSON[i].imageUrl}">
					</div>
					<div>
						<h2>${responseJSON[i].name}</h2>
						<h3>Available: ${responseJSON[i].quantityAvailable}</h3>
						<button class="remove-item">Remove item</button>
						<button class="change-availability">Change amount available</button>
					</div>
					<div>
						<h3>Price: ${responseJSON[i].price}</h3>
						<button class="edit-price">Edit price</button>
					</div>
				</div>`
			}
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