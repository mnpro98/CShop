function watchLogin(){
	let login_btn = document.getElementById('login');

	let username = document.getElementById('email').value;
	let password = document.getElementById('password');

	let email_lbl = document.getElementById('email-label');
	let password_lbl = document.getElementById('password-label');

	login_btn.addEventListener('click', (event) => {
		event.preventDefault();

		console.log(username);

		let flag = 0;

		if(username == ""){
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
			let url = `/bookmark?username=${username}`;
			let settings = {
				method : 'GET'
			}

			fetch( url, settings )
				.then( response => {
					if( response.ok ){
						return response.json();
					}
					throw new Error( response.statusText );
				})
				.then( responseJSON => {
					if(responseJSON[0].password == password.value)
						document.location.href = "./home.html";
					else
						console.log("Incorrect username or password");
				})
				.catch( err => {
					console.log("Incorrect username or password. " + err.message);
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