<script lang="typescript">
    import { Note } from './../models/tab/note';
    import { playing } from './../state/tab.selectors';
    import { onMount, onDestroy  } from 'svelte';
	import { tweened, spring } from 'svelte/motion';
    import { linear } from 'svelte/easing';
    
    export let laneWidth;
    export let note: Note;
    let y;
    let duration = 5000;
    let unsub;

	onMount(() => {
        let initialPosition = getNoteY(note);
        y = tweened(initialPosition, {
            duration: 100000,
            easing: linear
        });

        unsub = playing.subscribe((playback) => {
            if (playback.playing) {
                y.set(initialPosition+duration);
            } else if (playback.paused) {
                // this is odd, it doesn't set back to initial, but "pauses"
                // it's what i want, but how does it work
                y.set(initialPosition);
            } else {
                y.set(initialPosition, {
                    duration: 500
                });
            }
        });
    });

    onDestroy(() => unsub);

	function getNoteX(note: Note): number {
		return note.x*(laneWidth+1) + 10;
	}

	function getNoteY(note: Note) {
		return note.y*laneWidth + 10;
    }
    
	function getNoteLabel(label: string): string {
		return label.substring(0, 1);
	}
</script>

{#if y}
    <circle
        cx={getNoteX(note)} cy={$y} r={note['radius']}
        fill="#FC0"
        stroke="#666">
    </circle>
    <text x={getNoteX(note) - 5} y={$y + 4}>
        {getNoteLabel(note.name)}
    </text>
{/if}