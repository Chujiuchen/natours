import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings =async (name, email) => {
	try {
		// Send a PATCH request to update user settings
		const res = await axios({
			method: 'PATCH',
			url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
			data: {
				name,
				email
			}
		});
		// If the response is successful, show ia success alert and redirect to the user's profile page
		if (res.data.status === 'success') {
			showAlert('success', 'Update Settings Successfully!');
			window.setTimeout(() => {
				window.location.href = '/me';
			}, 3000);
		}
	} catch (error) {
		showAlert('error', error.response.data.message);
	}
};