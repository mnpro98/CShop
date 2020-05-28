var itemDisplay = document.getElementById('item-history');


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
	    	let priceItem = responseJSON.price * item.quantity;
			itemDisplay.innerHTML += `
				<div class="item">
					<div>
						<img src="${responseJSON.imageUrl}">
					</div>
					<div>
						<h2>${responseJSON.name}</h2>
						<h3>Quantity: ${item.quantity}</h3>
					</div>
					<div>
						<h3>Price: $${priceItem}</h3>
					</div>
				</div>`;
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
		for(let i = 0; i < responseJSON.purchasedItems.length; i++){
			getItem(responseJSON.purchasedItems[i]);
		}
    })
    .catch( err => {
      console.log(err.message);
    });
}



function init(){
	getItems();
}

init();