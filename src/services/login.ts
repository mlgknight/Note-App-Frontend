import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/login';

interface Credentials {
	username: string;
	password: string;
}

interface LoginResponse {
	token: string;
	user: {
		id: string;
		username: string;
	};
}

const login = async (credentials: Credentials): Promise<LoginResponse> => {
	const response = await axios.post<LoginResponse>(baseUrl, credentials);
	return response.data;
};

export default { login };
