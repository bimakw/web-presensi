<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	let { children } = $props();

	$effect(() => {
		if (browser && !auth.isAuthenticated) {
			goto('/login');
		}
	});
</script>

{#if auth.isAuthenticated}
	<div class="min-h-screen bg-gray-50 flex flex-col">
		<Navbar />
		<main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
			{@render children()}
		</main>
		<Footer />
	</div>
{/if}
