<template>
	<div
		class="my-10 mx-2 flex flex-col justify-center space-y-6 overflow-x-hidden"
		v-if="guilds && Object.keys(guilds).length > 0"
	>
		<template v-for="guild in guilds">
			<div :key="guild.id" class="sm:mx-auto">
				<router-link :to="guild.bot_joined ? open(guild.id) : invite(guild.id)">
					<div
						class="group flex w-full cursor-pointer items-center justify-between rounded-md bg-black/30 p-4 text-2xl tracking-wide shadow-lg transition duration-200 hover:bg-black/50 hover:shadow-xl sm:w-[30rem]"
					>
						<div class="flex max-w-[18rem] items-center space-x-4">
							<img
								v-if="guild.icon"
								:src="guild.icon"
								alt="Guild Icon"
								class="h-16 w-16 rounded-full"
							/>
							<div
								v-if="!guild.icon"
								class="grid h-16 w-16 place-items-center rounded-full bg-indigo-600"
							>
								<span class="text-lg font-medium">{{ guild.initials }}</span>
							</div>
							<h3 class="hidden truncate sm:block">
								{{ truncate(guild.name) }}
							</h3>
							<h3 class="sm:hidden">{{ truncate(guild.initials, 4) }}</h3>
						</div>

						<a v-if="guild.bot_joined" class="">
							<button
								class="btn rounded bg-green-600 px-4 py-2 text-lg font-medium transition duration-200 group-hover:bg-green-500"
							>
								Dashboard
							</button>
						</a>
						<a v-else>
							<button
								class="btn rounded bg-indigo-600 px-4 py-2 text-lg font-medium transition duration-200 group-hover:bg-indigo-500"
							>
								Setup
							</button>
						</a>
					</div>
				</router-link>
			</div>
		</template>
	</div>
</template>

<script>
export default {
	name: "GuildList",
	props: {
		guilds: {
			type: Array,
			required: true,
		},
		baseInviteUrl: {
			type: String,
			required: true,
		},
	},
	async mounted() {
		console.log(this.guilds.length);
	},
	methods: {
		truncate(name, int) {
			let string = String(name);
			if (int) {
				if (string.length > int + 1) {
					return string.substring(0, int);
				}
			} else if (string.length > 41) {
				return string.substring(0, 41) + "...";
			}
			return string;
		},
		open(id) {
			return `dashboard/home?{${id}`;
		},
		get_invite_url(id) {
			return this.baseInviteUrl + "&guild_id=" + id;
		},
		invite(id) {
			return this.get_invite_url(id);
		},
	},
};
</script>
