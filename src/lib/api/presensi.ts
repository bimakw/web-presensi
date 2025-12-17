import { api } from './client';
import type {
	ApiResponse,
	ApiResponseWithMeta,
	CreatePresensiRequest,
	Presensi,
	PresensiFilter,
	UpdatePresensiRequest
} from '$lib/types';

export const presensiApi = {
	getAll: (filter?: PresensiFilter) => {
		const params: Record<string, string> = {};
		if (filter?.user_id) params.user_id = filter.user_id;
		if (filter?.status) params.status = filter.status;
		if (filter?.start_date) params.start_date = filter.start_date;
		if (filter?.end_date) params.end_date = filter.end_date;
		if (filter?.page) params.page = String(filter.page);
		if (filter?.limit) params.limit = String(filter.limit);

		return api.get<ApiResponseWithMeta<Presensi[]>>('/api/presensi', params);
	},

	getById: (id: string) => api.get<ApiResponse<Presensi>>(`/api/presensi/${id}`),

	create: (data: CreatePresensiRequest) =>
		api.post<ApiResponse<Presensi>>('/api/presensi', data),

	update: (id: string, data: UpdatePresensiRequest) =>
		api.put<ApiResponse<Presensi>>(`/api/presensi/${id}`, data),

	delete: (id: string) => api.delete<ApiResponse<null>>(`/api/presensi/${id}`),

	checkIn: (id: string, location?: { latitude: number; longitude: number }) =>
		api.post<ApiResponse<null>>(`/api/presensi/${id}/checkin`, location),

	checkOut: (id: string, location?: { latitude: number; longitude: number }) =>
		api.post<ApiResponse<null>>(`/api/presensi/${id}/checkout`, location)
};
