<script lang="typescript">
    import { Note } from './../models/tab/note';
    import { playback, offset } from './../state/tab.selectors';
    import { onMount, onDestroy, afterUpdate } from 'svelte';
	import { tweened } from 'svelte/motion';
    import { linear, cubicOut } from 'svelte/easing';
    
    export let laneWidth: number;
    export let note: Note;
    export let playAt: number;

    let y;
    let setPlayed = false;
    let subs = [];
	onMount(() => {
        let initialPosition = getNoteY(note);
        note.play();
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
                setPlayed = true;
            } else if (playback.paused) {
                y.set(initialPosition);
                setPlayed = false;
            } else if (playback.stopped) {
                // console.log(initialPosition + (playback.offset * 20))
                // not sure why this is off by one, should be 20
                y.set(initialPosition + (playback.offset * 19), {
                    duration: 100,
                    easing: cubicOut
                });
                setPlayed = false;
            }
        }));
        
		let frame;
		(function loop() {
			frame = requestAnimationFrame(loop);
			// check notes under the highlighter
			playNote(playAt);
		}());

		return () => {
			cancelAnimationFrame(frame);
		}
    });

    onDestroy(() => {
        subs.forEach(unsub => unsub());
    });

    afterUpdate(() => {
        if (!setPlayed) {
            const _playAt = Math.round(playAt / 20);
            const _notePosition = ($y + $offset - 10) / 20;
            if (_playAt < previousPosition && note.played === false && _notePosition === _playAt) {
                note.play();
                note.played = true;
            } else {
                note.played = false;
            }
            previousPosition = _playAt;
        }
    });

    let previousPosition;
    function playNote(playPosition) {
        if (Math.round($y + $offset) - 10 === Math.round(playPosition)) {
            if (setPlayed && note.played === false) {
                // play button clicked
                note.play();
                note.played = true;
            }
        }
    }

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