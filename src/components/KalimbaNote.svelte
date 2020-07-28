<script lang="typescript">
    import { Note } from './../models/tab/note';
    import { playing, duration } from './../state/tab.selectors';
    import { onMount, onDestroy  } from 'svelte';
	import { tweened, spring } from 'svelte/motion';
    import { linear } from 'svelte/easing';
    import { play } from '../utils/audio';
    
    export let laneWidth;
    export let note: Note;
    let y;
    let _duration: number;
    let unsub;
    let unduration;

	onMount(() => {
        let initialPosition = getNoteY(note);
        playSound();
        y = tweened(initialPosition, {
            duration: _duration,
            easing: linear
        });
        unduration = duration.subscribe(tabDuration => {
            _duration = tabDuration;
        });

        unsub = playing.subscribe((playback) => {
            if (playback.playing) {
                y.set(initialPosition+(_duration*20));
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

    onDestroy(() => {
        unsub();
        unduration();
    });

	function getNoteX(note: Note): number {
		return note.x*(laneWidth+1) + 10;
	}

	function getNoteY(note: Note) {
		return note.y*laneWidth + 10;
    }
    
	function getNoteLabel(label: string): string {
		return label.substring(0, 1);
    }
    
    function playSound() {
        play(note.name);
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