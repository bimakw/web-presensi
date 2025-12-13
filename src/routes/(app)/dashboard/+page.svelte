<script lang="ts">
	import { onMount } from 'svelte';
	import { presensiApi } from '$lib/api';
	import { auth } from '$lib/stores/auth.svelte';
	import { Card, Badge, Button, Alert } from '$lib/components/ui';
	import type { Presensi, StatusPresensi } from '$lib/types';

	let todayPresensi = $state<Presensi | null>(null);
	let recentPresensi = $state<Presensi[]>([]);
	let loading = $state(true);
	let error = $state('');
	let actionLoading = $state(false);

	const statusVariant: Record<StatusPresensi, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
		hadir: 'success',
		terlambat: 'warning',
		izin: 'info',
		sakit: 'info',
		cuti: 'info',
		alpha: 'danger'
	};

	const statusLabel: Record<StatusPresensi, string> = {
		hadir: 'Hadir',
		terlambat: 'Terlambat',
		izin: 'Izin',
		sakit: 'Sakit',
		cuti: 'Cuti',
		alpha: 'Alpha'
	};

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatTime(timeStr: string | null) {
		if (!timeStr) return '-';
		return new Date(timeStr).toLocaleTimeString('id-ID', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	async function loadData() {
		try {
			const today = new Date().toISOString().split('T')[0];
			const response = await presensiApi.getAll({
				user_id: auth.user?.id,
				start_date: today,
				end_date: today,
				limit: 1
			});

			if (response.data.length > 0) {
				todayPresensi = response.data[0];
			}

			const recentResponse = await presensiApi.getAll({
				user_id: auth.user?.id,
				limit: 5
			});
			recentPresensi = recentResponse.data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal memuat data';
		} finally {
			loading = false;
		}
	}

	async function handleCheckIn() {
		if (!todayPresensi) return;
		actionLoading = true;
		try {
			await presensiApi.checkIn(todayPresensi.id);
			await loadData();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Check-in gagal';
		} finally {
			actionLoading = false;
		}
	}

	async function handleCheckOut() {
		if (!todayPresensi) return;
		actionLoading = true;
		try {
			await presensiApi.checkOut(todayPresensi.id);
			await loadData();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Check-out gagal';
		} finally {
			actionLoading = false;
		}
	}

	onMount(loadData);
</script>

<svelte:head>
	<title>Dashboard - Web Presensi</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
		<p class="text-gray-600">Selamat datang, {auth.user?.nama}</p>
	</div>

	{#if error}
		<Alert variant="error" dismissible>
			{error}
		</Alert>
	{/if}

	{#if loading}
		<div class="flex justify-center py-12">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Presensi Hari Ini</h2>
				<p class="text-sm text-gray-500 mb-4">{formatDate(new Date().toISOString())}</p>

				{#if todayPresensi}
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<span class="text-gray-600">Status:</span>
							<Badge variant={statusVariant[todayPresensi.status]}>
								{statusLabel[todayPresensi.status]}
							</Badge>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-600">Jam Masuk:</span>
							<span class="font-medium">{formatTime(todayPresensi.jam_masuk)}</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-600">Jam Keluar:</span>
							<span class="font-medium">{formatTime(todayPresensi.jam_keluar)}</span>
						</div>

						<div class="flex gap-2 pt-4">
							{#if !todayPresensi.jam_masuk}
								<Button onclick={handleCheckIn} loading={actionLoading} class="flex-1">
									Check In
								</Button>
							{:else if !todayPresensi.jam_keluar}
								<Button onclick={handleCheckOut} loading={actionLoading} class="flex-1">
									Check Out
								</Button>
							{:else}
								<p class="text-green-600 text-sm">Presensi hari ini sudah lengkap</p>
							{/if}
						</div>
					</div>
				{:else}
					<div class="text-center py-8">
						<p class="text-gray-500 mb-4">Belum ada presensi hari ini</p>
						<Button onclick={() => window.location.href = '/presensi'}>
							Buat Presensi
						</Button>
					</div>
				{/if}
			</Card>

			<Card class="p-6">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Statistik Bulan Ini</h2>
				<div class="grid grid-cols-2 gap-4">
					<div class="bg-green-50 rounded-lg p-4 text-center">
						<p class="text-2xl font-bold text-green-600">
							{recentPresensi.filter((p) => p.status === 'hadir').length}
						</p>
						<p class="text-sm text-green-700">Hadir</p>
					</div>
					<div class="bg-yellow-50 rounded-lg p-4 text-center">
						<p class="text-2xl font-bold text-yellow-600">
							{recentPresensi.filter((p) => p.status === 'terlambat').length}
						</p>
						<p class="text-sm text-yellow-700">Terlambat</p>
					</div>
					<div class="bg-blue-50 rounded-lg p-4 text-center">
						<p class="text-2xl font-bold text-blue-600">
							{recentPresensi.filter((p) => ['izin', 'sakit', 'cuti'].includes(p.status)).length}
						</p>
						<p class="text-sm text-blue-700">Izin/Sakit/Cuti</p>
					</div>
					<div class="bg-red-50 rounded-lg p-4 text-center">
						<p class="text-2xl font-bold text-red-600">
							{recentPresensi.filter((p) => p.status === 'alpha').length}
						</p>
						<p class="text-sm text-red-700">Alpha</p>
					</div>
				</div>
			</Card>
		</div>

		<Card class="p-6">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-lg font-semibold text-gray-900">Riwayat Presensi Terbaru</h2>
				<a href="/presensi" class="text-sm text-blue-600 hover:text-blue-500">
					Lihat Semua
				</a>
			</div>

			{#if recentPresensi.length === 0}
				<p class="text-gray-500 text-center py-8">Belum ada riwayat presensi</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead>
							<tr>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									Tanggal
								</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									Status
								</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									Jam Masuk
								</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									Jam Keluar
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							{#each recentPresensi as presensi}
								<tr>
									<td class="px-4 py-3 text-sm text-gray-900">
										{formatDate(presensi.tanggal)}
									</td>
									<td class="px-4 py-3">
										<Badge variant={statusVariant[presensi.status]}>
											{statusLabel[presensi.status]}
										</Badge>
									</td>
									<td class="px-4 py-3 text-sm text-gray-600">
										{formatTime(presensi.jam_masuk)}
									</td>
									<td class="px-4 py-3 text-sm text-gray-600">
										{formatTime(presensi.jam_keluar)}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</Card>
	{/if}
</div>
