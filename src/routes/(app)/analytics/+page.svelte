<script lang="ts">
	import { onMount } from 'svelte';
	import { analyticsApi } from '$lib/api';
	import { auth } from '$lib/stores/auth.svelte';
	import { Card, Alert, Select } from '$lib/components/ui';
	import type { AnalyticsSummary, MonthlyAnalytics, DailyStat } from '$lib/types';

	let loading = $state(true);
	let error = $state('');

	let summary = $state<AnalyticsSummary | null>(null);
	let monthlyData = $state<MonthlyAnalytics | null>(null);
	let statusBreakdown = $state<Record<string, number> | null>(null);

	let selectedMonth = $state(getCurrentMonth());

	function getCurrentMonth() {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
	}

	function getMonthOptions() {
		const options = [];
		const now = new Date();
		for (let i = 0; i < 12; i++) {
			const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
			const label = date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
			options.push({ value, label });
		}
		return options;
	}

	async function loadData() {
		loading = true;
		error = '';
		try {
			const [summaryRes, monthlyRes, breakdownRes] = await Promise.all([
				analyticsApi.getSummary(),
				analyticsApi.getMonthly(selectedMonth),
				analyticsApi.getStatusBreakdown()
			]);

			summary = summaryRes.data;
			monthlyData = monthlyRes.data;
			statusBreakdown = breakdownRes.data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal memuat data analytics';
		} finally {
			loading = false;
		}
	}

	function handleMonthChange() {
		loadData();
	}

	function getStatusColor(status: string): string {
		const colors: Record<string, string> = {
			hadir: 'bg-green-500',
			terlambat: 'bg-yellow-500',
			izin: 'bg-blue-500',
			sakit: 'bg-purple-500',
			cuti: 'bg-cyan-500',
			alpha: 'bg-red-500'
		};
		return colors[status] || 'bg-gray-500';
	}

	function getStatusLabel(status: string): string {
		const labels: Record<string, string> = {
			hadir: 'Hadir',
			terlambat: 'Terlambat',
			izin: 'Izin',
			sakit: 'Sakit',
			cuti: 'Cuti',
			alpha: 'Alpha'
		};
		return labels[status] || status;
	}

	function calculatePercentage(value: number, total: number): number {
		if (total === 0) return 0;
		return Math.round((value / total) * 100);
	}

	function getMaxDailyCount(stats: DailyStat[]): number {
		if (!stats || stats.length === 0) return 1;
		return Math.max(...stats.map((s) => s.count), 1);
	}

	function formatDayLabel(dateStr: string): string {
		const date = new Date(dateStr);
		return date.getDate().toString();
	}

	onMount(loadData);
</script>

<svelte:head>
	<title>Statistik - Web Presensi</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Statistik Presensi</h1>
			<p class="text-gray-600">Analisis kehadiran karyawan</p>
		</div>
		<div class="w-full sm:w-48">
			<Select id="month" bind:value={selectedMonth} onchange={handleMonthChange}>
				{#each getMonthOptions() as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</Select>
		</div>
	</div>

	{#if error}
		<Alert variant="error" dismissible>{error}</Alert>
	{/if}

	{#if loading}
		<div class="flex justify-center py-12">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
		</div>
	{:else}
		<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
			<Card class="p-4 text-center">
				<p class="text-3xl font-bold text-gray-900">{summary?.total_records || 0}</p>
				<p class="text-sm text-gray-500">Total Record</p>
			</Card>
			<Card class="p-4 text-center bg-green-50">
				<p class="text-3xl font-bold text-green-600">{summary?.total_hadir || 0}</p>
				<p class="text-sm text-green-700">Hadir</p>
			</Card>
			<Card class="p-4 text-center bg-yellow-50">
				<p class="text-3xl font-bold text-yellow-600">{summary?.total_terlambat || 0}</p>
				<p class="text-sm text-yellow-700">Terlambat</p>
			</Card>
			<Card class="p-4 text-center bg-blue-50">
				<p class="text-3xl font-bold text-blue-600">{summary?.total_izin || 0}</p>
				<p class="text-sm text-blue-700">Izin</p>
			</Card>
			<Card class="p-4 text-center bg-purple-50">
				<p class="text-3xl font-bold text-purple-600">{summary?.total_sakit || 0}</p>
				<p class="text-sm text-purple-700">Sakit</p>
			</Card>
			<Card class="p-4 text-center bg-red-50">
				<p class="text-3xl font-bold text-red-600">{summary?.total_alpha || 0}</p>
				<p class="text-sm text-red-700">Alpha</p>
			</Card>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Distribusi Status</h2>

				{#if statusBreakdown}
					{@const total = Object.values(statusBreakdown).reduce((a, b) => a + b, 0)}
					<div class="space-y-4">
						{#each Object.entries(statusBreakdown) as [status, count]}
							{@const percentage = calculatePercentage(count, total)}
							<div>
								<div class="flex items-center justify-between mb-1">
									<span class="text-sm font-medium text-gray-700">
										{getStatusLabel(status)}
									</span>
									<span class="text-sm text-gray-500">{count} ({percentage}%)</span>
								</div>
								<div class="w-full bg-gray-200 rounded-full h-2.5">
									<div
										class="{getStatusColor(status)} h-2.5 rounded-full transition-all duration-300"
										style="width: {percentage}%"
									></div>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-gray-500 text-center py-8">Tidak ada data</p>
				{/if}
			</Card>

			<Card class="p-6">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Persentase Kehadiran</h2>

				<div class="flex items-center justify-center py-8">
					<div class="relative w-40 h-40">
						<svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
							<circle
								class="text-gray-200"
								stroke-width="10"
								stroke="currentColor"
								fill="transparent"
								r="40"
								cx="50"
								cy="50"
							/>
							<circle
								class="text-green-500"
								stroke-width="10"
								stroke="currentColor"
								fill="transparent"
								r="40"
								cx="50"
								cy="50"
								stroke-dasharray={`${(summary?.percentage_hadir || 0) * 2.51} 251`}
								stroke-linecap="round"
							/>
						</svg>
						<div class="absolute inset-0 flex items-center justify-center">
							<div class="text-center">
								<span class="text-3xl font-bold text-gray-900">
									{Math.round(summary?.percentage_hadir || 0)}%
								</span>
								<p class="text-sm text-gray-500">Kehadiran</p>
							</div>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4 mt-4">
					<div class="text-center p-3 bg-green-50 rounded-lg">
						<p class="text-xl font-bold text-green-600">
							{(summary?.total_hadir || 0) + (summary?.total_terlambat || 0)}
						</p>
						<p class="text-xs text-green-700">Masuk Kerja</p>
					</div>
					<div class="text-center p-3 bg-red-50 rounded-lg">
						<p class="text-xl font-bold text-red-600">{summary?.total_alpha || 0}</p>
						<p class="text-xs text-red-700">Tidak Masuk</p>
					</div>
				</div>
			</Card>
		</div>

		<Card class="p-6">
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Grafik Harian</h2>

			{#if monthlyData?.daily_stats && monthlyData.daily_stats.length > 0}
				{@const maxCount = getMaxDailyCount(monthlyData.daily_stats)}
				<div class="overflow-x-auto">
					<div class="min-w-[600px]">
						<div class="flex items-end gap-1 h-48">
							{#each monthlyData.daily_stats as stat}
								{@const height = (stat.count / maxCount) * 100}
								<div class="flex-1 flex flex-col items-center">
									<div
										class="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
										style="height: {height}%"
										title="{stat.date}: {stat.count} presensi"
									></div>
								</div>
							{/each}
						</div>
						<div class="flex gap-1 mt-2">
							{#each monthlyData.daily_stats as stat}
								<div class="flex-1 text-center">
									<span class="text-xs text-gray-500">{formatDayLabel(stat.date)}</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{:else}
				<p class="text-gray-500 text-center py-8">Tidak ada data untuk bulan ini</p>
			{/if}
		</Card>

		{#if auth.user?.role === 'admin'}
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Ringkasan</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div class="bg-gray-50 rounded-lg p-4">
						<div class="flex items-center">
							<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
								<svg
									class="w-5 h-5 text-blue-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</div>
							<div class="ml-3">
								<p class="text-sm text-gray-500">Total Record</p>
								<p class="text-lg font-semibold text-gray-900">
									{monthlyData?.summary.total_records || 0}
								</p>
							</div>
						</div>
					</div>

					<div class="bg-gray-50 rounded-lg p-4">
						<div class="flex items-center">
							<div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
								<svg
									class="w-5 h-5 text-green-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div class="ml-3">
								<p class="text-sm text-gray-500">Rata-rata Harian</p>
								<p class="text-lg font-semibold text-gray-900">
									{monthlyData?.daily_stats
										? Math.round(
												monthlyData.daily_stats.reduce((a, b) => a + b.count, 0) /
													(monthlyData.daily_stats.length || 1)
											)
										: 0}
								</p>
							</div>
						</div>
					</div>

					<div class="bg-gray-50 rounded-lg p-4">
						<div class="flex items-center">
							<div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
								<svg
									class="w-5 h-5 text-purple-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<div class="ml-3">
								<p class="text-sm text-gray-500">Hari Aktif</p>
								<p class="text-lg font-semibold text-gray-900">
									{monthlyData?.daily_stats?.filter((s) => s.count > 0).length || 0}
								</p>
							</div>
						</div>
					</div>
				</div>
			</Card>
		{/if}
	{/if}
</div>
