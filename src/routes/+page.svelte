<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { auth } from '$lib/stores/auth.svelte';
	import { Button, Card } from '$lib/components/ui';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	$effect(() => {
		if (browser && auth.isAuthenticated) {
			goto('/dashboard');
		}
	});
</script>

<svelte:head>
	<title>Web Presensi - Sistem Presensi Karyawan</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
	<Navbar />

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
		<div class="text-center">
			<h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
				Sistem Presensi
				<span class="text-blue-600">Modern</span>
			</h1>
			<p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
				Kelola kehadiran karyawan dengan mudah dan efisien.
				Pantau presensi secara real-time dengan antarmuka yang intuitif.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button size="lg" onclick={() => goto('/login')}>
					Mulai Sekarang
				</Button>
				<Button size="lg" variant="secondary" onclick={() => goto('/register')}>
					Daftar Gratis
				</Button>
			</div>
		</div>

		<div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
			<Card class="p-6 text-center">
				<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
					<svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">Check-in Mudah</h3>
				<p class="text-gray-600">
					Lakukan check-in dan check-out dengan satu klik. Cepat dan efisien.
				</p>
			</Card>

			<Card class="p-6 text-center">
				<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
					<svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">Laporan Lengkap</h3>
				<p class="text-gray-600">
					Lihat statistik kehadiran secara detail dengan visualisasi yang informatif.
				</p>
			</Card>

			<Card class="p-6 text-center">
				<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
					<svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">Aman & Terpercaya</h3>
				<p class="text-gray-600">
					Data presensi Anda aman dengan sistem autentikasi yang kuat.
				</p>
			</Card>
		</div>
	</main>

	<Footer />
</div>
