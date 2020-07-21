<script lang="typescript">
	import { play, pause, stop } from '../state/tab.facade';
    import { playing } from './../state/tab.selectors';
	
    // export let pieceDuration;
	// controls

	function nextBar(): void {
		// 
	}

	function prevBar(): void {
		// 
	}
</script>

<section>
    <div>
        <button on:click={play} disabled={$playing.playing}>Play</button>
        <button on:click={pause} disabled={!$playing.playing}>Pause</button>
        <button on:click={stop} disabled={!$playing.playing && !$playing.paused}>Stop</button>
    </div>
</section>