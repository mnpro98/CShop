function deleteCart(){
	let url = `/deleteCart/${localStorage.email}`;
	let settings = {
		method : 'PATCH',
		headers : {
		  'Content-Type' : 'application/json'
		}
	};

	fetch( url, settings )
		.then( response => {
			if( response.ok ){
				return response.json();
			} else
				throw new Error( response.statusText );
		})
		.catch( err => {
			console.log("");
		});
}

function transaction(items){
	let notificationMessage = document.getElementById('notification');

	let url = `/cartToHistory/${localStorage.email}`;
	let settings = {
		method : 'PATCH',
		headers : {
		  'Content-Type' : 'application/json'
		},
		body : JSON.stringify(items)
	};

	fetch( url, settings )
		.then( response => {
			if( response.ok ){
				return response.json();
			} else
				throw new Error( response.statusText );
		})
		.then( responseJSON => {
			deleteCart();
			notificationMessage.innerHTML = `<p>Payment successful</p>`;
		})
		.catch( err => {
			deleteCart();
			notificationMessage.innerHTML = `<p>Payment successful</p>`;
		});
}

function watchPay(){
	let pay_btn = document.getElementById('pay-btn');

	pay_btn.addEventListener('click', (event) => {
		event.preventDefault();

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
				let cartItems = responseJSON.cart;

				transaction(cartItems);
			})
			.catch( err => {
				console.log(err.message);
			});
	});
}


function init(){
	watchPay();
}

init();