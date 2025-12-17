<script lang="ts">
	let currentYear = new Date().getFullYear();
</script>

<footer class="bg-white border-t border-gray-200 mt-auto">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div>
				<h3 class="text-lg font-bold text-blue-600 mb-4">WebPresensi</h3>
				<p class="text-sm text-gray-600">
					Sistem manajemen presensi modern untuk memudahkan tracking kehadiran karyawan.
				</p>
			</div>

			<div>
				<h4 class="text-sm font-semibold text-gray-900 mb-4">Links</h4>
				<ul class="space-y-2">
					<li>
						<a href="/dashboard" class="text-sm text-gray-600 hover:text-blue-600">Dashboard</a>
					</li>
					<li>
						<a href="/presensi" class="text-sm text-gray-600 hover:text-blue-600">Presensi</a>
					</li>
					<li>
						<a href="/analytics" class="text-sm text-gray-600 hover:text-blue-600">Statistik</a>
					</li>
					<li>
						<a href="/profile" class="text-sm text-gray-600 hover:text-blue-600">Profil</a>
					</li>
				</ul>
			</div>

			<div>
				<h4 class="text-sm font-semibold text-gray-900 mb-4">Teknologi</h4>
				<ul class="space-y-2">
					<li class="text-sm text-gray-600">SvelteKit 2.x</li>
					<li class="text-sm text-gray-600">Tailwind CSS 4.x</li>
					<li class="text-sm text-gray-600">TypeScript</li>
				</ul>
			</div>
		</div>

		<div class="border-t border-gray-200 mt-8 pt-8">
			<p class="text-center text-sm text-gray-500">
				&copy; {currentYear} Web Presensi. Built by
				<a
					href="https://github.com/bimakw"
					target="_blank"
					rel="noopener noreferrer"
					class="text-blue-600 hover:underline"
				>
					Bima Kharisma Wicaksana
				</a>
			</p>
		</div>
	</div>
</footer>
