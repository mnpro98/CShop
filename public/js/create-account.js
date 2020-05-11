function watchSignUp(){
	let signup_btn = document.getElementById('sign-up');
	let conf_message = document.getElementById('confirm-message');

	signup_btn.addEventListener('click', (event) => {
		event.preventDefault();

		let fnameO 		= 	document.getElementById('fname');
		let lnameO 		= 	document.getElementById('lname');
		let dbirthO 	= 	document.getElementById('dbirth');
		let sexMO 		= 	document.getElementById('male');
		let sexFO 		= 	document.getElementById('female');
		let emailO 		= 	document.getElementById('email');
		let passwordO 	= 	document.getElementById('password');
		let cpasswordO 	= 	document.getElementById('cpassword');

		if(!fnameO.value || !lnameO.value || !dbirthO.value || !sexMO.checked && !sexFO.checked || 
			!emailO.value || !passwordO.value || !cpasswordO.value){
			conf_message.innerHTML = "Please fill out all fields.";
		} else {
			if(passwordO.value != cpasswordO.value)
				conf_message.innerHTML = "Password and confirm password fields do not match.";
			else {

				let content = {};

				content.email = emailO.value;
				content.password = passwordO.value;
				content.fname = fnameO.value;
				content.lname = lnameO.value;
				content.dob = dbirthO.value;
				if(sexMO.checked)
					content.sex = "m";
				else
					content.sex = "f";
				content.admin = false;

				let url = "/createuser";
				let settings = {
					method : 'POST',
					headers : {
						'Content-Type' : 'application/json'
					},
					body : JSON.stringify(content)
				};

				fetch( url, settings )
					.then( response => {
						if( response.ok ){
							return response.json();
						}
						throw new Error( response.statusText );
					})
					.then( responseJSON => {
						conf_message.innerHTML = "Account created successfully!";
					})
					.catch( err => {
						conf_message.innerHTML = `<div>${err.message}</div>`
					});
			}
		}
	});
}




function init(){
	watchSignUp();
}

init();