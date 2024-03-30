import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
//判断是否有这个元素
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateUser = document.querySelector('.form-user-data');
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
if (logOutBtn) {
	logOutBtn.addEventListener('click', () => {
		logout();
	});
}
if (updateUser) {
	updateUser.addEventListener('submit', e => {
		e.preventDefault();//阻止默认提交
		const name = document.getElementById('name').value;//获取输入框的name值
		const email = document.getElementById('email').value;//获取输入框的email值
		updateSettings(name, email);//调用更新函数
	});
}
