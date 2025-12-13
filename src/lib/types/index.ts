export interface User {
	id: string;
	email: string;
	nama: string;
	role: 'admin' | 'employee';
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface Lokasi {
	latitude: number;
	longitude: number;
	alamat: string;
}

export type StatusPresensi = 'hadir' | 'izin' | 'sakit' | 'alpha' | 'terlambat' | 'cuti';

export interface Presensi {
	id: string;
	user_id: string;
	nama: string;
	tanggal: string;
	jam_masuk: string | null;
	jam_keluar: string | null;
	status: StatusPresensi;
	keterangan: string;
	lokasi: Lokasi | null;
	created_at: string;
	updated_at: string;
}

export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

export interface ApiResponseWithMeta<T> extends ApiResponse<T> {
	meta: {
		page: number;
		limit: number;
		total: number;
		total_pages: number;
	};
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	nama: string;
	role?: string;
}

export interface LoginResponse {
	token: string;
	user: User;
}

export interface CreatePresensiRequest {
	user_id: string;
	nama: string;
	status: StatusPresensi;
	keterangan?: string;
	latitude?: number;
	longitude?: number;
	alamat?: string;
}

export interface UpdatePresensiRequest {
	status?: StatusPresensi;
	keterangan?: string;
}

export interface PresensiFilter {
	user_id?: string;
	status?: StatusPresensi;
	start_date?: string;
	end_date?: string;
	page?: number;
	limit?: number;
}
