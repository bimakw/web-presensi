import { api } from './client';
import type { ApiResponse, AnalyticsSummary, MonthlyAnalytics, UserAnalytics } from '$lib/types';

export const analyticsApi = {
	getSummary: () => api.get<ApiResponse<AnalyticsSummary>>('/api/analytics/summary'),

	getDaily: (date: string) =>
		api.get<ApiResponse<AnalyticsSummary>>('/api/analytics/daily', { date }),

	getMonthly: (month: string) =>
		api.get<ApiResponse<MonthlyAnalytics>>('/api/analytics/monthly', { month }),

	getUserStats: (userId: string) =>
		api.get<ApiResponse<UserAnalytics>>(`/api/analytics/user/${userId}`),

	getStatusBreakdown: () =>
		api.get<
			ApiResponse<{
				hadir: number;
				terlambat: number;
				izin: number;
				sakit: number;
				cuti: number;
				alpha: number;
			}>
		>('/api/analytics/status-breakdown')
};
