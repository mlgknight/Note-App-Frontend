import loginService from '../services/login';
import { type FormEvent, useRef } from 'react';
import { type User } from '../../types';

interface LoginFormProps {
	setUser: (user: User) => void;
	setError: (error: string | null) => void;
}

const LoginForm = ({ setUser, setError}: LoginFormProps) => {
	const usernameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const username = usernameRef.current?.value.trim() || '';
		const password = passwordRef.current?.value.trim() || '';

		if (!username) {
			setError('Please fill out the username');
			setTimeout(() => setError(null), 5000);
			return;
		}

		if (!password) {
			setError('Please fill out the password');
			setTimeout(() => setError(null), 5000);
			return;
		}

		try {
			const userCredentials = await loginService.login({
				username,
				password,
			});
			setUser(userCredentials);

			// Clear the form after successful login
			if (usernameRef.current) usernameRef.current.value = '';
			if (passwordRef.current) passwordRef.current.value = '';
		} catch (error) {
			setError('Wrong credentials');
			console.log(error);
			setTimeout(() => {
				setError(null);
			}, 5000);
		}
	};

	return (
		<form onSubmit={handleLogin}>
			<div>
				username
				<input ref={usernameRef} type='text' name='Username' />
			</div>
			<div>
				password
				<input ref={passwordRef} type='password' name='Password' />
			</div>
			<button type='submit'>login</button>
		</form>
	);
};

export default LoginForm;
