<script lang="ts">
	import { goto } from '$app/navigation';
	import { authApi } from '$lib/api';
	import { Button, Input, Card, Alert } from '$lib/components/ui';

	let nama = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let error = $state('');
	let success = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		success = '';

		if (password !== confirmPassword) {
			error = 'Password tidak sama';
			return;
		}

		if (password.length < 6) {
			error = 'Password minimal 6 karakter';
			return;
		}

		loading = true;

		try {
			await authApi.register({ email, password, nama });
			success = 'Registrasi berhasil! Silakan login.';
			setTimeout(() => goto('/login'), 2000);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Registrasi gagal';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Register - Web Presensi</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h1 class="text-center text-3xl font-bold text-gray-900">Web Presensi</h1>
		<h2 class="mt-2 text-center text-lg text-gray-600">Buat akun baru</h2>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<Card class="px-6 py-8">
			{#if error}
				<Alert variant="error" dismissible class="mb-4">
					{error}
				</Alert>
			{/if}

			{#if success}
				<Alert variant="success" class="mb-4">
					{success}
				</Alert>
			{/if}

			<form onsubmit={handleSubmit} class="space-y-6">
				<Input
					id="nama"
					type="text"
					label="Nama Lengkap"
					placeholder="John Doe"
					bind:value={nama}
					required
				/>

				<Input
					id="email"
					type="email"
					label="Email"
					placeholder="email@example.com"
					bind:value={email}
					required
				/>

				<Input
					id="password"
					type="password"
					label="Password"
					placeholder="••••••••"
					bind:value={password}
					required
				/>

				<Input
					id="confirmPassword"
					type="password"
					label="Konfirmasi Password"
					placeholder="••••••••"
					bind:value={confirmPassword}
					required
				/>

				<Button type="submit" class="w-full" {loading}>
					{loading ? 'Memproses...' : 'Register'}
				</Button>
			</form>

			<p class="mt-6 text-center text-sm text-gray-600">
				Sudah punya akun?
				<a href="/login" class="font-medium text-blue-600 hover:text-blue-500">
					Login sekarang
				</a>
			</p>
		</Card>
	</div>
</div>
