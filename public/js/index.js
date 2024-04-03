import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
//判断是否有这个元素
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateUser = document.querySelector('.form-user-data');
const updateUserPassword = document.querySelector('.form-user-password');
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
		const form = new FormData();
		form.append('name', document.getElementById('name').value);//获取输入框的name值
		form.append('email', document.getElementById('email').value);//获取输入框的email值
		form.append('photo', document.getElementById('photo').files[0]);//获取输入框的photo值

		updateSettings(form, 'data');//调用更新函数
	});
}
if (updateUserPassword) {
	updateUserPassword.addEventListener('submit', async e => {
		e.preventDefault();
		document.querySelector('.btn-password-change').textContent = 'Updating...';
		const passwordCurrent = document.getElementById('password-current').value;
		const password = document.getElementById('password').value;
		const passwordConfirm = document.getElementById('password-confirm').value;
	  await	updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

		document.querySelector('.btn-password-change').textContent = 'Save password';
		document.getElementById('password-current').value = '';
		document.getElementById('password').value = '';
		document.getElementById('password-confirm').value = '';
	});
}
