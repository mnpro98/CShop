function watchAddItem(){
	let addBtn = document.getElementById('create-item-btn');
	let conf_message = document.getElementById('message');

	addBtn.addEventListener('click', (event) => {
		event.preventDefault();

		let itemName 	= 	document.getElementById('iname');
		let itemPrice 	= 	document.getElementById('price');
		let quantity 	= 	document.getElementById('quantity');

		if(!itemName.value || !itemPrice.value || !quantity.value){
			conf_message.innerHTML = "Please fill out all fields.";
		} else {

			let content = {};

			content.name = itemName.value;
			content.description = `${itemName.value} is the name of this item and it is very cool.`
			content.price = itemPrice.value;
			content.quantityAvailable = quantity.value;
			content.imageUrl = "./media/itemplaceholder.PNG";

			let url = "/createitem";
			let settings = {
				method : 'POST',
				headers : {
					'Content-Type' : 'application/json'
				},
				body : JSON.stringify(content)
			};

			fetch( url, settings )
				.then( response => {
					if( response.ok ){
						return response.json();
					}
					throw new Error( response.statusText );
				})
				.then( responseJSON => {
					conf_message.innerHTML = "Item created successfully!";
				})
				.catch( err => {
					conf_message.innerHTML = `<div>${err.message}</div>`
				});
		}
	});
}

function back(){
	let backBtn = document.getElementById('go-back');

	backBtn.addEventListener('click', (submit) => {
		event.preventDefault();

		document.location.href = "./admin.html";
	});
}




function init(){
	watchAddItem();
	back();
}

init();