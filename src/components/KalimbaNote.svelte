<script lang="typescript">
    import { Note } from './../models/tab/note';
    import { playback, offset } from './../state/tab.selectors';
    import { onMount, onDestroy } from 'svelte';
	import { tweened } from 'svelte/motion';
    import { linear, cubicOut } from 'svelte/easing';
    import { play } from '../utils/audio';
    
    export let laneWidth: number;
    export let note: Note;
    let y;
    let subs = [];
	onMount(() => {
        let initialPosition = getNoteY(note);
        playSound();
        y = tweened(initialPosition, {
            duration: 0,
            easing: linear
        });
    
        subs.push(playback.subscribe((playback) => {

            const duration = playback.duration * 1000 / (playback.tempo / 60);
            if (playback.playing) {
                y.set(initialPosition+(playback.duration * 20), {
                    duration
                });
            } else if (playback.paused) {
                y.set(initialPosition);
            } else if (playback.stopped) {
                // console.log(initialPosition + (playback.offset * 20))
                // not sure why this is off by one, should be 20
                y.set(initialPosition + (playback.offset * 19), {
                    duration: 100,
                    easing: cubicOut
                });
            }
        }));
    });

    onDestroy(() => {
        subs.forEach(unsub => unsub());
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
        cx={getNoteX(note)} cy={$y + $offset} r={note['radius']}
        fill="#FC0"
        stroke="#666">
    </circle>
    <text x={getNoteX(note) - 5} y={$y + $offset + 4}>
        {getNoteLabel(note.name)}
    </text>
{/if}

<style>
    text {
        user-select: none;
    }
</style>