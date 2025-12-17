<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let menuOpen = $state(false);

	function handleLogout() {
		auth.logout();
		goto('/login');
	}
</script>

<nav class="bg-white shadow-sm border-b border-gray-200">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<div class="flex items-center">
				<a href="/" class="flex items-center">
					<span class="text-xl font-bold text-blue-600">WebPresensi</span>
				</a>

				{#if auth.isAuthenticated}
					<div class="hidden md:flex md:ml-10 space-x-4">
						<a
							href="/dashboard"
							class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
						>
							Dashboard
						</a>
						<a
							href="/presensi"
							class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
						>
							Presensi
						</a>
						<a
							href="/analytics"
							class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
						>
							Statistik
						</a>
						{#if auth.user?.role === 'admin'}
							<a
								href="/admin"
								class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
							>
								Admin
							</a>
						{/if}
					</div>
				{/if}
			</div>

			<div class="flex items-center">
				{#if auth.isAuthenticated}
					<div class="hidden md:flex items-center space-x-4">
						<a
							href="/profile"
							class="flex items-center text-sm text-gray-700 hover:text-blue-600"
						>
							<span class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
								<span class="text-sm font-medium text-blue-600">
									{auth.user?.nama?.charAt(0).toUpperCase() || 'U'}
								</span>
							</span>
							{auth.user?.nama}
						</a>
						<Button variant="ghost" size="sm" onclick={handleLogout}>
							Logout
						</Button>
					</div>

					<div class="md:hidden">
						<button
							type="button"
							class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
							onclick={() => (menuOpen = !menuOpen)}
						>
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								{#if menuOpen}
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								{:else}
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								{/if}
							</svg>
						</button>
					</div>
				{:else}
					<div class="flex items-center space-x-2">
						<Button variant="ghost" size="sm" onclick={() => goto('/login')}>
							Login
						</Button>
						<Button size="sm" onclick={() => goto('/register')}>
							Register
						</Button>
					</div>
				{/if}
			</div>
		</div>
	</div>

	{#if menuOpen && auth.isAuthenticated}
		<div class="md:hidden border-t border-gray-200">
			<div class="px-2 pt-2 pb-3 space-y-1">
				<a
					href="/dashboard"
					class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
				>
					Dashboard
				</a>
				<a
					href="/presensi"
					class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
				>
					Presensi
				</a>
				<a
					href="/analytics"
					class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
				>
					Statistik
				</a>
				{#if auth.user?.role === 'admin'}
					<a
						href="/admin"
						class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
					>
						Admin
					</a>
				{/if}
				<div class="border-t border-gray-200 pt-2 mt-2">
					<a
						href="/profile"
						class="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
					>
						<span class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
							<span class="text-sm font-medium text-blue-600">
								{auth.user?.nama?.charAt(0).toUpperCase() || 'U'}
							</span>
						</span>
						{auth.user?.nama}
					</a>
					<button
						type="button"
						class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
						onclick={handleLogout}
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	{/if}
</nav>
