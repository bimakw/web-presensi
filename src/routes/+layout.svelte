<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Web Presensi</title>
	<meta name="description" content="Sistem Presensi Karyawan" />
</svelte:head>

{@render children()}
