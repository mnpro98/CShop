function watchPay(){
	let pay_btn = document.getElementById('pay-btn');

	pay_btn.addEventListener('click', (event) => {
		event.preventDefault();
		
		document.location.href = "./home.html";
	});
}




function init(){
	watchPay();
}

init();