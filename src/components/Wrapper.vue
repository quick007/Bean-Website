<template>
	<div class="flex min-h-screen flex-col bg-zinc-900 md:px-0">
		<Navbar v-bind:navfixed="fixed"></Navbar>
		<div class="flex-1 bg-zinc-850">
			<div>
				<slot></slot>
			</div>
		</div>
		<Footer :white="white" />
	</div>
</template>

<script>
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default {
	name: "Wrapper",
	components: { Navbar, Footer },
	props: ["fixed", "white"],
};
</script>
