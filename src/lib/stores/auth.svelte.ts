import { browser } from '$app/environment';
import type { User } from '$lib/types';

function createAuthStore() {
	let user = $state<User | null>(null);
	let token = $state<string | null>(null);
	let isAuthenticated = $derived(!!token && !!user);

	if (browser) {
		const storedToken = localStorage.getItem('token');
		const storedUser = localStorage.getItem('user');
		if (storedToken && storedUser) {
			token = storedToken;
			user = JSON.parse(storedUser);
		}
	}

	return {
		get user() {
			return user;
		},
		get token() {
			return token;
		},
		get isAuthenticated() {
			return isAuthenticated;
		},

		login(newToken: string, newUser: User) {
			token = newToken;
			user = newUser;
			if (browser) {
				localStorage.setItem('token', newToken);
				localStorage.setItem('user', JSON.stringify(newUser));
			}
		},

		logout() {
			token = null;
			user = null;
			if (browser) {
				localStorage.removeItem('token');
				localStorage.removeItem('user');
			}
		},

		updateUser(newUser: User) {
			user = newUser;
			if (browser) {
				localStorage.setItem('user', JSON.stringify(newUser));
			}
		}
	};
}

export const auth = createAuthStore();
