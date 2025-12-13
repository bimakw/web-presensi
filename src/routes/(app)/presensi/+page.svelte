<script lang="ts">
	import { onMount } from 'svelte';
	import { presensiApi } from '$lib/api';
	import { auth } from '$lib/stores/auth.svelte';
	import { Card, Badge, Button, Input, Select, Modal, Alert } from '$lib/components/ui';
	import type { Presensi, StatusPresensi, CreatePresensiRequest } from '$lib/types';

	let presensiList = $state<Presensi[]>([]);
	let loading = $state(true);
	let error = $state('');
	let success = $state('');

	let page = $state(1);
	let totalPages = $state(1);
	let limit = 10;

	let filterStatus = $state('');
	let filterStartDate = $state('');
	let filterEndDate = $state('');

	let showCreateModal = $state(false);
	let createLoading = $state(false);
	let newPresensi = $state<CreatePresensiRequest>({
		user_id: '',
		nama: '',
		status: 'hadir',
		keterangan: ''
	});

	let showDeleteModal = $state(false);
	let deleteId = $state('');
	let deleteLoading = $state(false);

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
			weekday: 'short',
			year: 'numeric',
			month: 'short',
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
		loading = true;
		error = '';
		try {
			const response = await presensiApi.getAll({
				user_id: auth.user?.role === 'employee' ? auth.user?.id : undefined,
				status: filterStatus as StatusPresensi || undefined,
				start_date: filterStartDate || undefined,
				end_date: filterEndDate || undefined,
				page,
				limit
			});
			presensiList = response.data;
			totalPages = response.meta.total_pages;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal memuat data';
		} finally {
			loading = false;
		}
	}

	function openCreateModal() {
		newPresensi = {
			user_id: auth.user?.id || '',
			nama: auth.user?.nama || '',
			status: 'hadir',
			keterangan: ''
		};
		showCreateModal = true;
	}

	async function handleCreate(e: Event) {
		e.preventDefault();
		createLoading = true;
		error = '';

		try {
			await presensiApi.create(newPresensi);
			success = 'Presensi berhasil dibuat';
			showCreateModal = false;
			await loadData();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal membuat presensi';
		} finally {
			createLoading = false;
		}
	}

	function openDeleteModal(id: string) {
		deleteId = id;
		showDeleteModal = true;
	}

	async function handleDelete() {
		deleteLoading = true;
		error = '';

		try {
			await presensiApi.delete(deleteId);
			success = 'Presensi berhasil dihapus';
			showDeleteModal = false;
			await loadData();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal menghapus presensi';
		} finally {
			deleteLoading = false;
		}
	}

	async function handleCheckIn(id: string) {
		try {
			await presensiApi.checkIn(id);
			success = 'Check-in berhasil';
			await loadData();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Check-in gagal';
		}
	}

	async function handleCheckOut(id: string) {
		try {
			await presensiApi.checkOut(id);
			success = 'Check-out berhasil';
			await loadData();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Check-out gagal';
		}
	}

	function handleFilter() {
		page = 1;
		loadData();
	}

	function resetFilter() {
		filterStatus = '';
		filterStartDate = '';
		filterEndDate = '';
		page = 1;
		loadData();
	}

	onMount(loadData);
</script>

<svelte:head>
	<title>Presensi - Web Presensi</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Daftar Presensi</h1>
			<p class="text-gray-600">Kelola data presensi</p>
		</div>
		<Button onclick={openCreateModal}>
			Tambah Presensi
		</Button>
	</div>

	{#if error}
		<Alert variant="error" dismissible>
			{error}
		</Alert>
	{/if}

	{#if success}
		<Alert variant="success" dismissible>
			{success}
		</Alert>
	{/if}

	<Card class="p-4">
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
			<Select id="filterStatus" label="Status" bind:value={filterStatus}>
				<option value="">Semua Status</option>
				<option value="hadir">Hadir</option>
				<option value="terlambat">Terlambat</option>
				<option value="izin">Izin</option>
				<option value="sakit">Sakit</option>
				<option value="cuti">Cuti</option>
				<option value="alpha">Alpha</option>
			</Select>
			<Input
				id="filterStartDate"
				type="date"
				label="Tanggal Mulai"
				bind:value={filterStartDate}
			/>
			<Input
				id="filterEndDate"
				type="date"
				label="Tanggal Akhir"
				bind:value={filterEndDate}
			/>
			<div class="flex items-end gap-2">
				<Button onclick={handleFilter} class="flex-1">Filter</Button>
				<Button variant="ghost" onclick={resetFilter}>Reset</Button>
			</div>
		</div>
	</Card>

	<Card>
		{#if loading}
			<div class="flex justify-center py-12">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		{:else if presensiList.length === 0}
			<div class="text-center py-12">
				<p class="text-gray-500">Tidak ada data presensi</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Tanggal
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Nama
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Status
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Jam Masuk
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Jam Keluar
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Aksi
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each presensiList as presensi}
							<tr>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{formatDate(presensi.tanggal)}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{presensi.nama}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<Badge variant={statusVariant[presensi.status]}>
										{statusLabel[presensi.status]}
									</Badge>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
									{formatTime(presensi.jam_masuk)}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
									{formatTime(presensi.jam_keluar)}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm">
									<div class="flex gap-2">
										{#if !presensi.jam_masuk}
											<Button size="sm" onclick={() => handleCheckIn(presensi.id)}>
												Check In
											</Button>
										{:else if !presensi.jam_keluar}
											<Button size="sm" variant="secondary" onclick={() => handleCheckOut(presensi.id)}>
												Check Out
											</Button>
										{/if}
										{#if auth.user?.role === 'admin'}
											<Button
												size="sm"
												variant="danger"
												onclick={() => openDeleteModal(presensi.id)}
											>
												Hapus
											</Button>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			{#if totalPages > 1}
				<div class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
					<Button
						variant="ghost"
						disabled={page === 1}
						onclick={() => { page--; loadData(); }}
					>
						Sebelumnya
					</Button>
					<span class="text-sm text-gray-600">
						Halaman {page} dari {totalPages}
					</span>
					<Button
						variant="ghost"
						disabled={page === totalPages}
						onclick={() => { page++; loadData(); }}
					>
						Selanjutnya
					</Button>
				</div>
			{/if}
		{/if}
	</Card>
</div>

<Modal bind:open={showCreateModal} title="Tambah Presensi">
	<form onsubmit={handleCreate} class="space-y-4">
		<Select
			id="status"
			label="Status"
			bind:value={newPresensi.status}
			required
		>
			<option value="hadir">Hadir</option>
			<option value="terlambat">Terlambat</option>
			<option value="izin">Izin</option>
			<option value="sakit">Sakit</option>
			<option value="cuti">Cuti</option>
		</Select>

		<Input
			id="keterangan"
			type="text"
			label="Keterangan"
			placeholder="Keterangan (opsional)"
			bind:value={newPresensi.keterangan}
		/>

		<div class="flex gap-2 justify-end pt-4">
			<Button variant="ghost" type="button" onclick={() => (showCreateModal = false)}>
				Batal
			</Button>
			<Button type="submit" loading={createLoading}>
				Simpan
			</Button>
		</div>
	</form>
</Modal>

<Modal bind:open={showDeleteModal} title="Konfirmasi Hapus">
	<p class="text-gray-600 mb-4">Apakah Anda yakin ingin menghapus presensi ini?</p>
	<div class="flex gap-2 justify-end">
		<Button variant="ghost" onclick={() => (showDeleteModal = false)}>
			Batal
		</Button>
		<Button variant="danger" onclick={handleDelete} loading={deleteLoading}>
			Hapus
		</Button>
	</div>
</Modal>
