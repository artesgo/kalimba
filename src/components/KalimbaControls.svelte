<script lang="typescript">
	import { play, pause, stop } from '../state/tab.facade';
    import { playback } from './../state/tab.selectors';
</script>

<section>
	<button on:click={play} disabled={$playback.playing}>Play</button>
	<button on:click={pause} disabled={!$playback.playing}>Pause</button>
	<button on:click={stop} disabled={!$playback.playing && !$playback.paused}>Stop</button>
</section>