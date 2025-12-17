<script lang="ts">
	import { auth } from '$lib/stores/auth.svelte';
	import { authApi } from '$lib/api';
	import { Card, Button, Input, Alert } from '$lib/components/ui';

	let loading = $state(false);
	let error = $state('');
	let success = $state('');

	let showPasswordForm = $state(false);
	let passwordData = $state({
		current_password: '',
		new_password: '',
		confirm_password: ''
	});
	let passwordLoading = $state(false);
	let passwordError = $state('');
	let passwordSuccess = $state('');

	function formatDate(dateStr: string | undefined) {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('id-ID', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	async function handleChangePassword(e: Event) {
		e.preventDefault();
		passwordError = '';
		passwordSuccess = '';

		if (passwordData.new_password !== passwordData.confirm_password) {
			passwordError = 'Password baru dan konfirmasi tidak cocok';
			return;
		}

		if (passwordData.new_password.length < 6) {
			passwordError = 'Password minimal 6 karakter';
			return;
		}

		passwordLoading = true;
		try {
			await authApi.changePassword({
				current_password: passwordData.current_password,
				new_password: passwordData.new_password
			});
			passwordSuccess = 'Password berhasil diubah';
			passwordData = { current_password: '', new_password: '', confirm_password: '' };
			showPasswordForm = false;
		} catch (err) {
			passwordError = err instanceof Error ? err.message : 'Gagal mengubah password';
		} finally {
			passwordLoading = false;
		}
	}

	async function refreshProfile() {
		loading = true;
		error = '';
		try {
			const response = await authApi.getProfile();
			auth.updateUser(response.data);
			success = 'Profil berhasil diperbarui';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal memuat profil';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Profil - Web Presensi</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Profil Saya</h1>
		<p class="text-gray-600">Kelola informasi akun Anda</p>
	</div>

	{#if error}
		<Alert variant="error" dismissible>{error}</Alert>
	{/if}

	{#if success}
		<Alert variant="success" dismissible>{success}</Alert>
	{/if}

	{#if passwordSuccess}
		<Alert variant="success" dismissible>{passwordSuccess}</Alert>
	{/if}

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<Card class="p-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg font-semibold text-gray-900">Informasi Akun</h2>
				<Button variant="ghost" size="sm" onclick={refreshProfile} loading={loading}>
					Refresh
				</Button>
			</div>

			<div class="flex items-center mb-6">
				<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
					<span class="text-2xl font-bold text-blue-600">
						{auth.user?.nama?.charAt(0).toUpperCase() || 'U'}
					</span>
				</div>
				<div class="ml-4">
					<h3 class="text-lg font-medium text-gray-900">{auth.user?.nama}</h3>
					<p class="text-sm text-gray-500">{auth.user?.email}</p>
				</div>
			</div>

			<div class="space-y-4">
				<div class="flex justify-between py-3 border-b border-gray-100">
					<span class="text-gray-600">Email</span>
					<span class="font-medium text-gray-900">{auth.user?.email}</span>
				</div>
				<div class="flex justify-between py-3 border-b border-gray-100">
					<span class="text-gray-600">Nama</span>
					<span class="font-medium text-gray-900">{auth.user?.nama}</span>
				</div>
				<div class="flex justify-between py-3 border-b border-gray-100">
					<span class="text-gray-600">Role</span>
					<span
						class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {auth
							.user?.role === 'admin'
							? 'bg-purple-100 text-purple-800'
							: 'bg-blue-100 text-blue-800'}"
					>
						{auth.user?.role === 'admin' ? 'Administrator' : 'Karyawan'}
					</span>
				</div>
				<div class="flex justify-between py-3 border-b border-gray-100">
					<span class="text-gray-600">Status</span>
					<span
						class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {auth
							.user?.is_active
							? 'bg-green-100 text-green-800'
							: 'bg-red-100 text-red-800'}"
					>
						{auth.user?.is_active ? 'Aktif' : 'Tidak Aktif'}
					</span>
				</div>
				<div class="flex justify-between py-3 border-b border-gray-100">
					<span class="text-gray-600">Bergabung</span>
					<span class="font-medium text-gray-900">{formatDate(auth.user?.created_at)}</span>
				</div>
				<div class="flex justify-between py-3">
					<span class="text-gray-600">Terakhir Update</span>
					<span class="font-medium text-gray-900">{formatDate(auth.user?.updated_at)}</span>
				</div>
			</div>
		</Card>

		<Card class="p-6">
			<h2 class="text-lg font-semibold text-gray-900 mb-6">Keamanan</h2>

			{#if passwordError}
				<Alert variant="error" dismissible class="mb-4">{passwordError}</Alert>
			{/if}

			{#if !showPasswordForm}
				<div class="space-y-4">
					<div class="flex items-center justify-between py-3 border-b border-gray-100">
						<div>
							<p class="font-medium text-gray-900">Password</p>
							<p class="text-sm text-gray-500">Terakhir diubah: Tidak diketahui</p>
						</div>
						<Button variant="secondary" size="sm" onclick={() => (showPasswordForm = true)}>
							Ubah Password
						</Button>
					</div>

					<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
						<div class="flex">
							<svg
								class="h-5 w-5 text-yellow-400 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							<div>
								<h4 class="text-sm font-medium text-yellow-800">Tips Keamanan</h4>
								<p class="text-sm text-yellow-700 mt-1">
									Gunakan password yang kuat dengan kombinasi huruf, angka, dan simbol.
								</p>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<form onsubmit={handleChangePassword} class="space-y-4">
					<Input
						id="current_password"
						type="password"
						label="Password Saat Ini"
						placeholder="Masukkan password saat ini"
						bind:value={passwordData.current_password}
						required
					/>
					<Input
						id="new_password"
						type="password"
						label="Password Baru"
						placeholder="Masukkan password baru"
						bind:value={passwordData.new_password}
						required
					/>
					<Input
						id="confirm_password"
						type="password"
						label="Konfirmasi Password"
						placeholder="Konfirmasi password baru"
						bind:value={passwordData.confirm_password}
						required
					/>

					<div class="flex gap-2 pt-4">
						<Button
							variant="ghost"
							type="button"
							onclick={() => {
								showPasswordForm = false;
								passwordError = '';
								passwordData = { current_password: '', new_password: '', confirm_password: '' };
							}}
						>
							Batal
						</Button>
						<Button type="submit" loading={passwordLoading}>Simpan Password</Button>
					</div>
				</form>
			{/if}
		</Card>
	</div>
</div>
