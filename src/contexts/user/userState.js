import { useEffect, useState } from 'react';
import UserContext from './userContext';
import { ApiContext } from '../api/apiContext';
import { useContext } from 'react';
import { jwtDecode } from 'jwt-decode';


export function UserState({ children }) {

	const { accessToken } = useContext(ApiContext);

	const [userLoading, setUserLoading] = useState(true);
	const [userError, setUserError] = useState('');
	const [userData, setUserData] = useState({
		loggedIn: false,
		name: '',
		email: '',
		profilePictureUrl: '',
		roles: [],
	});

	async function fetchUserData() {
		try {
			setUserLoading(true);
			if (accessToken) {
				const userProfile = jwtDecode(accessToken);

				let roles = [];
				if (typeof userProfile.role === 'string') {
					userProfile.role?.split(',').forEach((role) => {
						roles.push(role);
					});
				} else {
					roles = userProfile.role;
				}

				setUserData((userData) => {
					return {
						email: userProfile.email,
						name: userProfile.name,
						profilePictureUrl: userProfile.picture,
						loggedIn: true,
						roles: roles,
					};
				});
			} else {
				setUserData((userData) => {
					return {
						loggedIn: false,
						name: '',
						email: '',
						profilePictureUrl: '',
						roles: [],
					};
				});
			}
		} catch (err) {
			setUserError('Error fetching user data');
			console.log(err);
		} finally {
			setUserLoading(false);
		}
	}

	useEffect(() => {
		fetchUserData();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accessToken]);

	function logout() {
		setUserLoading(true);
		setUserData({
			loggedIn: false,
			name: '',
			email: '',
			profilePictureUrl: '',
			roles: [],
		});
		setUserError('');
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		setUserLoading(false);
	}

	return (
		<UserContext.Provider
			value={{ userData, userLoading, userError, logout }}
		>
			{children}
		</UserContext.Provider>
	);
}

