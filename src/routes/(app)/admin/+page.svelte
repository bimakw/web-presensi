<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { usersApi } from '$lib/api';
	import { auth } from '$lib/stores/auth.svelte';
	import { Card, Badge, Button, Modal, Alert } from '$lib/components/ui';
	import type { User } from '$lib/types';

	let users = $state<User[]>([]);
	let loading = $state(true);
	let error = $state('');
	let success = $state('');

	let page = $state(1);
	let totalPages = $state(1);
	let total = $state(0);
	let limit = 10;

	let showStatusModal = $state(false);
	let selectedUser = $state<User | null>(null);
	let statusLoading = $state(false);

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	async function loadUsers() {
		loading = true;
		error = '';
		try {
			const response = await usersApi.getAll(page, limit);
			users = response.data;
			total = response.meta.total;
			totalPages = response.meta.total_pages;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal memuat data user';
		} finally {
			loading = false;
		}
	}

	function openStatusModal(user: User) {
		selectedUser = user;
		showStatusModal = true;
	}

	async function handleToggleStatus() {
		if (!selectedUser) return;

		statusLoading = true;
		error = '';
		try {
			const newStatus = !selectedUser.is_active;
			await usersApi.updateStatus(selectedUser.id, newStatus);
			success = newStatus
				? `User ${selectedUser.nama} berhasil diaktifkan`
				: `User ${selectedUser.nama} berhasil dinonaktifkan`;
			showStatusModal = false;
			await loadUsers();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal mengubah status user';
		} finally {
			statusLoading = false;
		}
	}

	onMount(() => {
		if (auth.user?.role !== 'admin') {
			goto('/dashboard');
			return;
		}
		loadUsers();
	});
</script>

<svelte:head>
	<title>Admin - User Management</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-gray-900">User Management</h1>
		<p class="text-gray-600">Kelola user dan hak akses</p>
	</div>

	{#if error}
		<Alert variant="error" dismissible>{error}</Alert>
	{/if}

	{#if success}
		<Alert variant="success" dismissible>{success}</Alert>
	{/if}

	<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
		<Card class="p-4 text-center">
			<p class="text-3xl font-bold text-gray-900">{total}</p>
			<p class="text-sm text-gray-500">Total Users</p>
		</Card>
		<Card class="p-4 text-center bg-green-50">
			<p class="text-3xl font-bold text-green-600">
				{users.filter((u) => u.is_active).length}
			</p>
			<p class="text-sm text-green-700">Active</p>
		</Card>
		<Card class="p-4 text-center bg-red-50">
			<p class="text-3xl font-bold text-red-600">
				{users.filter((u) => !u.is_active).length}
			</p>
			<p class="text-sm text-red-700">Inactive</p>
		</Card>
		<Card class="p-4 text-center bg-purple-50">
			<p class="text-3xl font-bold text-purple-600">
				{users.filter((u) => u.role === 'admin').length}
			</p>
			<p class="text-sm text-purple-700">Admins</p>
		</Card>
	</div>

	<Card>
		{#if loading}
			<div class="flex justify-center py-12">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		{:else if users.length === 0}
			<div class="text-center py-12">
				<p class="text-gray-500">Tidak ada data user</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Bergabung
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each users as user}
							<tr class:bg-gray-50={!user.is_active}>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center">
										<div
											class="w-10 h-10 rounded-full flex items-center justify-center {user.is_active
												? 'bg-blue-100'
												: 'bg-gray-200'}"
										>
											<span
												class="text-sm font-medium {user.is_active
													? 'text-blue-600'
													: 'text-gray-500'}"
											>
												{user.nama.charAt(0).toUpperCase()}
											</span>
										</div>
										<div class="ml-3">
											<p class="text-sm font-medium text-gray-900">{user.nama}</p>
											<p class="text-xs text-gray-500">ID: {user.id.slice(0, 8)}...</p>
										</div>
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
									{user.email}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<Badge variant={user.role === 'admin' ? 'warning' : 'info'}>
										{user.role === 'admin' ? 'Admin' : 'Employee'}
									</Badge>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<Badge variant={user.is_active ? 'success' : 'danger'}>
										{user.is_active ? 'Active' : 'Inactive'}
									</Badge>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
									{formatDate(user.created_at)}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									{#if user.id !== auth.user?.id}
										<Button
											size="sm"
											variant={user.is_active ? 'danger' : 'secondary'}
											onclick={() => openStatusModal(user)}
										>
											{user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
										</Button>
									{:else}
										<span class="text-xs text-gray-400">Anda</span>
									{/if}
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
						onclick={() => {
							page--;
							loadUsers();
						}}
					>
						Sebelumnya
					</Button>
					<span class="text-sm text-gray-600"> Halaman {page} dari {totalPages} </span>
					<Button
						variant="ghost"
						disabled={page === totalPages}
						onclick={() => {
							page++;
							loadUsers();
						}}
					>
						Selanjutnya
					</Button>
				</div>
			{/if}
		{/if}
	</Card>
</div>

<Modal bind:open={showStatusModal} title="Konfirmasi Perubahan Status">
	{#if selectedUser}
		<div class="space-y-4">
			<p class="text-gray-600">
				{#if selectedUser.is_active}
					Apakah Anda yakin ingin <span class="font-semibold text-red-600">menonaktifkan</span> user
					<span class="font-semibold">{selectedUser.nama}</span>?
				{:else}
					Apakah Anda yakin ingin <span class="font-semibold text-green-600">mengaktifkan</span> user
					<span class="font-semibold">{selectedUser.nama}</span>?
				{/if}
			</p>

			{#if selectedUser.is_active}
				<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
					<p class="text-sm text-yellow-700">
						User yang dinonaktifkan tidak dapat login ke sistem.
					</p>
				</div>
			{/if}

			<div class="flex gap-2 justify-end pt-4">
				<Button variant="ghost" onclick={() => (showStatusModal = false)}>Batal</Button>
				<Button
					variant={selectedUser.is_active ? 'danger' : 'secondary'}
					onclick={handleToggleStatus}
					loading={statusLoading}
				>
					{selectedUser.is_active ? 'Nonaktifkan' : 'Aktifkan'}
				</Button>
			</div>
		</div>
	{/if}
</Modal>
