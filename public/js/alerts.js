//This file is alert messages

//Hide alert message
const hideAlert = () => {
	const alert = document.querySelector('.alert');
	if (alert) {
		alert.parentElement.removeChild(alert);
	}
}

//type: success, error
export const showAlert = (type, message) => {
	const markup = `<div class="alert alert--${type}">${message}</div>`;
	document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
	window.setTimeout(hideAlert, 3000)
}