import '@babel/polyfill';
import { login } from './login';

//判断是否有这个元素
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');

//进行数据判断
if (mapBox) {
	const locations = JSON.parse(mapBox.dataset.locations);
	console.log(locations);
}
if (loginForm) {
	loginForm.addEventListener('submit', e => {
		e.preventDefault();
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		login(email, password);
	});
}