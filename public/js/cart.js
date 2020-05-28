var cartItems = [];
var itemDisplay = document.getElementById('items-in-cart');

let itemCount = 0;
let totalPrice = 0;

function watchRemoveItem(){
	let remove_btns = document.querySelectorAll('.remove-item');
	for(i = 0; i < remove_btns.length; i++){
		remove_btns[i].addEventListener('click', (event) => {
			event.preventDefault();

			event.currentTarget.parentNode.parentNode.parentNode.removeChild(event.currentTarget.parentNode.parentNode);
		});
	}
}

function watchToCheckout(){
	let checkout_btn = document.getElementById('to-checkout');

	checkout_btn.addEventListener('click', (event) => {
		event.preventDefault();

		document.location.href = "./checkout.html";
	});
}

function getItem(item){
	let url = `/itembyid?id=${item.itemId}`;
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
	      } else
	      	throw new Error( response.statusText );
	    })
	    .then( responseJSON => {
	    	cartItems.push(responseJSON);
	    	priceItem = responseJSON.price * item.quantity;
			itemDisplay.innerHTML += `
				<div class="item-in-cart" id = item-${itemCount}>
					<div>
						<img src="${responseJSON.imageUrl}">
					</div>
					<div>
						<h2>${responseJSON.name}</h2>
						<h3>Quantity: ${item.quantity}</h3>
						<button class="remove-item">Remove item</button>
					</div>
					<div>
						<h3>Price: $${priceItem}</h3>
					</div>
				</div>`;
			itemCount++;
			totalPrice += priceItem;
			if(itemCount == cartItems.length){
				let totalToPay = document.getElementById('total-to-pay');
				totalToPay.innerHTML = `Total to pay: $${totalPrice.toFixed(2)}`;
				watchRemoveItem();
			}
	    })
	    .catch( err => {
			console.log(err.message);
	    });
}

function getItems(){

  let url = `/user?email=${localStorage.email}`;
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
      } else
      	throw new Error( response.statusText );
    })
    .then( responseJSON => {
		for(let i = 0; i < responseJSON.cart.length; i++){
			getItem(responseJSON.cart[i]);
		}
    })
    .catch( err => {
      console.log(err.message);
    });
}



function init(){
	watchToCheckout();
	getItems();
}

init();