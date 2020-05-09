function watchSignUp(){
	let signup_btn = document.getElementById('sign-up');
	let conf_message = document.getElementById('confirm-message');

	signup_btn.addEventListener('click', (event) => {
		event.preventDefault();
		conf_message.innerHTML = "Account created successfully!";
	});
}




function init(){
	watchSignUp();
}

init();