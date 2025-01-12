<template>
	<div
		class="mx-auto w-full max-w-screen-lg -translate-y-40 space-y-4 px-4 text-gray-200"
	>
		<template v-for="(user, index) in users">
			<div
				:key="index"
				class="group flex items-center justify-between rounded-md px-4 py-2 shadow-md"
				:class="{
					'bg-black/30': index != 0,
					'bg-amber-500': index == 0,
					'bg-zinc-500': index == 1,
					'bg-amber-800': index == 2,
					'mx-1 sm:mx-1': index == 1,
					'mx-1 sm:mx-2': index == 2,
					'mx-1 sm:mx-3': index != 0 && index != 1 && index != 2,
				}"
			>
				<div class="flex items-center space-x-4">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-black shadow-2xl"
						:class="{
							' bg-opacity-50': index == 0 || index == 1 || index == 2,
							'bg-opacity-100': index != 0 && index != 1 && index != 2,
						}"
					>
						<span
							v-if="index != 0 && index != 1 && index != 2"
							class="truncate font-medium"
						>
							{{ index + 1 }}
						</span>
						<span v-if="index == 0"> 🥇 </span>
						<span v-if="index == 1"> 🥈 </span>
						<span v-if="index == 2"> 🥉 </span>
					</div>
					<img
						class="flex h-14 w-14 items-center justify-center rounded-full bg-black bg-opacity-50"
						v-if="user.avatar"
						:src="user.avatar"
					/>
					<div class="">
						<h3 class="flex flex-col text-xl font-medium sm:flex-row">
							<span class="xs:hidden">{{ truncate(user.name, 7) }}</span>
							<span class="hidden xs:block"
								><span class="sm:hidden">{{
									truncate(user.name, 17)
								}}</span></span
							>
							<span class="hidden sm:block">{{ truncate(user.name) }}</span>
							<span
								class="ml-1 font-normal tracking-wide text-gray-400"
								:class="{
									'text-gray-800': index == 0,
									'text-gray-300': index == 1,
								}"
								>#{{ user.discriminator }}</span
							>
						</h3>
						<div
							class="mt-1 inline-flex rounded-2xl bg-rose-500 bg-opacity-50 px-2 font-medium transition-all group-hover:cursor-pointer group-hover:bg-rose-600/70"
						>
							<span class="sm:group-hover:hidden">
								{{ format(user.xp) + " exp" }}
							</span>
							<span class="hidden sm:group-hover:block"> Reset exp </span>
						</div>
					</div>
				</div>
				<div class="relative h-10 w-10">
					<div class="absolute inset-0">
						<svg
							class="aspect-square -rotate-90"
							style="--stroke: 12"
							:style="'--val: ' + getPercentage(user.xp)"
							viewBox="0 0 120 120"
						>
							<circle
								class="stroke-black/75 stroke-[number:var(--stroke)]"
								cx="60"
								cy="60"
								r="48"
								fill="none"
							/>
							<circle
								class="stroke-indigo-600 stroke-[number:calc(1+var(--stroke))] transition-[stroke-dashoffset] duration-500 [stroke-dasharray:100] [stroke-dashoffset:calc(100-var(--val))]"
								cx="60"
								cy="60"
								r="48"
								fill="none"
								pathLength="100"
							/>
						</svg>
					</div>
					<div class="grid h-full place-items-center font-medium leading-[0.7]">
						{{ getLevel(user.xp) }}
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
import { formatSI } from "format-si-prefix";

export default {
	name: "LeaderboardList",
	props: {
		users: {
			type: Array,
			required: true,
		},
	},
	methods: {
		truncate(name, length) {
			//css has truncating too, and its better bc its based on elm size rather than length
			let string = String(name);
			const l = length || 41;
			if (string.length > l) {
				return string.substring(0, l + 1) + "...";
			}
			return string;
		},
		format(xp) {
			return formatSI(xp);
		},
		getXpToLevelUp(current) {
			return 5 * (current * current) + 50 * current + 100;
		},
		getLevel(xp) {
			if (xp < 100) return 0;
			let counter = 0;
			let total = 0;
			for (;;) {
				const neededForNextLevel = this.getXpToLevelUp(counter);
				if (neededForNextLevel > xp) return counter;
				total += neededForNextLevel;
				if (total > xp) return counter;
				counter++;
			}
		},
		getTotalXPNeeded(level) {
			let x = 0;
			for (let i = 0; i < level; i++) {
				x += this.getXpToLevelUp(i);
			}
			return x;
		},
		getPercentage(xp) {
			const currentLevel = this.getLevel(xp);
			const needed = this.getXpToLevelUp(currentLevel);
			const currentXP = xp - this.getTotalXPNeeded(currentLevel);
			return (currentXP / needed) * 100;
		},
		getColor(index) {
			if (index == 0) return "amber";
			else if (index == 1) return "blue-grey darken-2";
			else if (index == 2) return "deep-orange darken-1";
			else return "blue-grey darken-4";
		},
	},
};
</script>
