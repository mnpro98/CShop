
function watchNavBtns(){
	let home_btn = document.getElementById('home');
	let search_btn = document.getElementById('search-btn');
	let history_btn = document.getElementById('purchase-history');
	let cart_btn = document.getElementById('cart');
	let about_us_btn = document.getElementById('about-us');

	home_btn.addEventListener('click', (event) => {
		event.preventDefault();
		document.location.href = "./home.html";
	});

	search_btn.addEventListener('click', (event) => {
		event.preventDefault();

		if(!document.URL.includes("/home.html")){
			document.location.href = "./home.html";
		}
	});

	history_btn.addEventListener('click', (event) => {
		event.preventDefault();
		document.location.href = "./purchase-history.html";
	});

	cart_btn.addEventListener('click', (event) => {
		event.preventDefault();
		document.location.href = "./cart.html";
	});

	about_us_btn.addEventListener('click', (event) => {
		event.preventDefault();
		document.location.href = "./about-us.html";
	});
}


function init(){
	watchNavBtns();
}


init();