import { api } from './client';
import type {
	ApiResponse,
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	User,
	ChangePasswordRequest
} from '$lib/types';

export const authApi = {
	login: (data: LoginRequest) => api.post<ApiResponse<LoginResponse>>('/api/auth/login', data),

	register: (data: RegisterRequest) =>
		api.post<ApiResponse<{ id: string; email: string; nama: string; role: string }>>(
			'/api/auth/register',
			data
		),

	getProfile: () => api.get<ApiResponse<User>>('/api/auth/profile'),

	changePassword: (data: ChangePasswordRequest) =>
		api.post<ApiResponse<null>>('/api/auth/change-password', data)
};
