<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface Props extends HTMLSelectAttributes {
		label?: string;
		error?: string;
		value?: string;
		children: Snippet;
	}

	let { label, error, id, class: className = '', value = $bindable(''), children, ...rest }: Props = $props();
</script>

<div class="w-full">
	{#if label}
		<label for={id} class="block text-sm font-medium text-gray-700 mb-1">
			{label}
		</label>
	{/if}
	<select
		{id}
		bind:value
		class="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {error
			? 'border-red-500'
			: 'border-gray-300'} {className}"
		{...rest}
	>
		{@render children()}
	</select>
	{#if error}
		<p class="mt-1 text-sm text-red-600">{error}</p>
	{/if}
</div>
