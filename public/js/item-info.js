
function watchAddToCart(){
	let add_btn = document.getElementById('add-to-cart');
	let confirm_message = document.getElementById('confirm-message');

	add_btn.addEventListener('click', (event) => {
		event.preventDefault();

		confirm_message.innerHTML = "Item added to cart!";
	});
}


function init(){
	watchAddToCart();
}

init();