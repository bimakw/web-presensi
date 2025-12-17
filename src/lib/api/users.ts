import { api } from './client';
import type { ApiResponse, ApiResponseWithMeta, User } from '$lib/types';

export const usersApi = {
	getAll: (page = 1, limit = 10) => {
		const params: Record<string, string> = {
			page: String(page),
			limit: String(limit)
		};
		return api.get<ApiResponseWithMeta<User[]>>('/api/users', params);
	},

	getById: (id: string) => api.get<ApiResponse<User>>(`/api/users/${id}`),

	updateStatus: (id: string, isActive: boolean) =>
		api.patch<ApiResponse<null>>(`/api/users/${id}/status`, { is_active: isActive })
};
