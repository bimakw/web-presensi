import { browser } from '$app/environment';

export interface GeoPosition {
	latitude: number;
	longitude: number;
	accuracy: number;
	timestamp: number;
}

function createGeolocationStore() {
	let position = $state<GeoPosition | null>(null);
	let error = $state<string | null>(null);
	let loading = $state(false);
	let isSupported = $derived(browser && 'geolocation' in navigator);

	async function getCurrentPosition(): Promise<GeoPosition> {
		if (!browser) {
			throw new Error('Geolocation only available in browser');
		}

		if (!('geolocation' in navigator)) {
			throw new Error('Geolocation tidak didukung oleh browser Anda');
		}

		loading = true;
		error = null;

		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					const newPosition: GeoPosition = {
						latitude: pos.coords.latitude,
						longitude: pos.coords.longitude,
						accuracy: pos.coords.accuracy,
						timestamp: pos.timestamp
					};
					position = newPosition;
					loading = false;
					resolve(newPosition);
				},
				(err) => {
					loading = false;
					let message = 'Gagal mendapatkan lokasi';

					switch (err.code) {
						case err.PERMISSION_DENIED:
							message = 'Akses lokasi ditolak. Harap izinkan akses lokasi di browser Anda.';
							break;
						case err.POSITION_UNAVAILABLE:
							message = 'Informasi lokasi tidak tersedia.';
							break;
						case err.TIMEOUT:
							message = 'Waktu permintaan lokasi habis.';
							break;
					}

					error = message;
					reject(new Error(message));
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 60000
				}
			);
		});
	}

	function clearPosition() {
		position = null;
		error = null;
	}

	return {
		get position() {
			return position;
		},
		get error() {
			return error;
		},
		get loading() {
			return loading;
		},
		get isSupported() {
			return isSupported;
		},
		getCurrentPosition,
		clearPosition
	};
}

export const geolocation = createGeolocationStore();
