<script lang="ts">
	import { goto } from '$app/navigation';
	import { authApi } from '$lib/api';
	import { auth } from '$lib/stores/auth.svelte';
	import { Button, Input, Card, Alert } from '$lib/components/ui';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			const response = await authApi.login({ email, password });
			auth.login(response.data.token, response.data.user);
			goto('/dashboard');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Login gagal';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Login - Web Presensi</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h1 class="text-center text-3xl font-bold text-gray-900">Web Presensi</h1>
		<h2 class="mt-2 text-center text-lg text-gray-600">Masuk ke akun Anda</h2>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<Card class="px-6 py-8">
			{#if error}
				<Alert variant="error" dismissible class="mb-4">
					{error}
				</Alert>
			{/if}

			<form onsubmit={handleSubmit} class="space-y-6">
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

				<Button type="submit" class="w-full" {loading}>
					{loading ? 'Memproses...' : 'Login'}
				</Button>
			</form>

			<p class="mt-6 text-center text-sm text-gray-600">
				Belum punya akun?
				<a href="/register" class="font-medium text-blue-600 hover:text-blue-500">
					Daftar sekarang
				</a>
			</p>
		</Card>
	</div>
</div>
