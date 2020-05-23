function watchLogin(){
	let login_btn = document.getElementById('login');

	let username = document.getElementById('email');
	let password = document.getElementById('password');

	let email_lbl = document.getElementById('email-label');
	let password_lbl = document.getElementById('password-label');

	let statusMessage = document.getElementById('status-message');

	login_btn.addEventListener('click', (event) => {
		event.preventDefault();

		let flag = 0;

		if(username.value == ""){
			email_lbl.innerHTML = "Type in your email.";
			flag = 1;
		} else {
			email_lbl.innerHTML = "";
		}

		if(password.value == ""){
			password_lbl.innerHTML = "Type in your password";
			flag = 1;
		} else {
			password_lbl.innerHTML = "";
		}

		if(flag == 0) {
			let url = `/users/login`;

			let data = {}

			data.email = username.value;
			data.password = password.value;

			let settings = {
				method : 'POST',
				headers : {
					'Content-Type' : 'application/json'
				},
				body : JSON.stringify(data)
			}

			fetch( url, settings )
				.then( response => {
					if( response.ok ){
						return response.json();
					}
					throw new Error( response.statusText );
				})
				.then( responseJSON => {
					localStorage.setItem('token', responseJSON.token);
					window.location.href = "./home.html";
				})
				.catch( err => {
					statusMessage.innerHTML = `${err.message}`;
				});
		}
	});
}


function watchSignup(){
	let signup_lnk = document.getElementById('signuplink');

	signup_lnk.addEventListener('click', (event) => {
		event.preventDefault();

		document.location.href = "./create-account.html";
	});
}


function init(){
	watchSignup();
	watchLogin();
}

init();