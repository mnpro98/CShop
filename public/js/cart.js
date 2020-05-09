
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



function init(){
	watchRemoveItem();
	watchToCheckout();
}

init();