import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
	try {
		const url = type === 'password' ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword' : 'http://127.0.0.1:3000/api/v1/users/updateMe';
		// Send a PATCH request to update user settings
		const res = await axios({
			method: 'PATCH',
			url,
			data
		});
		// If the response is successful, show ia success alert and redirect to the user's profile page
		if (res.data.status === 'success') {
			const message = type === 'password'? 'Password updated successfully!Please login again' : 'User settings updated successfully';
			showAlert('success', message);
			const type = 'password'? '/login' : '/me';
			window.setTimeout(() => {
				window.location.href = type;
			}, 2000);
		}
	} catch (error) {
		showAlert('error', error.response.data.message);
	}
};