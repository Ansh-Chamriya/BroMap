<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<div class="m-32 flex justify-end">
	<div class="w-fit">
		<h1 class="mb-8 w-fit font-sans text-5xl font-semibold">NIRBHIC</h1>
		<div class="ml-10 w-fit font-thin">
			<h2 class="text-3xl">N - Networked</h2>
			<h2 class="text-3xl">I <span class="ml-[0.9rem] text-3xl">- Initiative for</span></h2>
			<h2 class="text-3xl">R <span class="ml-1 text-3xl">- Rescuing and</span></h2>
			<h2 class="text-3xl">B <span class="ml-1 text-3xl">- Boosting</span></h2>
			<h2 class="text-3xl">H <span class="ml-[0.05rem] text-3xl">- Helpline and</span></h2>
			<h2 class="text-3xl">I <span class="ml-4 text-3xl">- Improving</span></h2>
			<h2 class="text-3xl">C <span class="ml-[0.3rem] text-3xl">- Community Of Womens</span></h2>
		</div>
		<a href="/map"><Button class=" m-10 mt-8 h-12 w-64 text-xl">Get Started</Button></a>
	</div>
	<div class="m-auto mr-4 w-fit">
		<img
			src="https://raw.githubusercontent.com/Ansh-Chamriya/BroMap/master/src/lib/homeImg.jpg"
			alt=""
			class=" size-[26rem] rounded-2xl"
		/>
	</div>
</div>

<style>
	:global(body) {
		background-color: #e3e5e7;
	}
</style>
