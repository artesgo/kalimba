<script lang="typescript">
	import GlobalStyles from './components/GlobalStyles.svelte';
	import KalimbaControls from './components/KalimbaControls.svelte';
	import KalimbaNote from './components/KalimbaNote.svelte';
	import KalimbaTines from './components/KalimbaTines.svelte';

	import { onMount, onDestroy } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { Subject } from 'rxjs';
	import { take } from 'rxjs/operators';

	import { truncator } from './utils/utils';

	import { Note } from './models/tab/note';
	import { Rect2d } from './models/shapes/rect2d';
 
	import { notes, offset, playback } from './state/tab.selectors';
	import { insertNote, updateOffset, deleteNote } from './state/tab.facade';

	// display height
	export let boardHeight = 640;

	let tines: Rect2d[] = [];
	let highlight: Rect2d;
	let tinelight: Rect2d;
	let currentPosition = 0;
	let previousPosition = 0;
	let currentPositionTine = 0;
	let previousPositionTine = 0;
	let bars = [];
	let cFill = true;

	const highlightPosition = tweened(0, {
		duration: 500,
		easing: cubicOut
	});
	const tinelightPosition = tweened(0, {
		duration: 500,
		easing: cubicOut
	});
	const tineLabels = ['d6', 'b5', 'g5', 'e5', 'c5', 'a4', 'f4', 'd4', 'c4', 'e4', 'g4', 'b4', 'd5', 'f5', 'a5', 'c6', 'e6'];
	const laneWidth = 20;
	const noteRadius = laneWidth / 2 - 2;
	const boardWidth = (laneWidth + 1) * tineLabels.length + 40;
	const noteLength = 4;
	const subs = [];
	onMount(() => {
		renderHighlighter();
		bars = new Array(boardHeight / laneWidth / 8);
		subs.push(playback.subscribe((_playback) => {
			if (_playback.playing) {
				let [first] = $notes;
				highlightPosition.set(first.y * laneWidth);
			}
		}));
	});

	onDestroy(() => {
		subs.forEach(unsub => unsub());
	});

	let hasNote$: Subject<boolean> = new Subject();
	// note management
	function hasNote(x, y): void {
		notes.subscribe(_n => {
			let found = _n.filter(note => note.x === x && note.y === y);
			if (found.length > 0) {
				hasNote$.next(true);
			} else {
				hasNote$.next(false);
			}
		});
	}

	function toggleNote(): void {
		if (currentPositionTine > 0 && currentPositionTine <= tineLabels.length) {
			hasNote$.pipe(
				take(1),
			).subscribe(_hasNote => {
				if (!_hasNote) {
					// TODO: currentPosition needs offset when going through the song
					let note = new Note(
						currentPositionTine,
						currentPosition - $offset,
						noteRadius, true);
					note.name = tineLabels[currentPositionTine - 1];
					insertNote(note);
				} else {
					deleteNote(currentPositionTine, currentPosition - $offset);
				}
			});
			hasNote(currentPositionTine, currentPosition - $offset);
		}
	}

	// cursor position
	let x = 0; let y = 0;
	function getPosition(event) {
		x = event.layerX;
		y = event.layerY;

		// get y axis position
		currentPosition = truncator(y / laneWidth, 0);
		if (currentPosition !== previousPosition) {
			highlightPosition.set(currentPosition * laneWidth);
			previousPosition = currentPosition;
		}

		// get x axis position
		let newPosition = truncator(x / (laneWidth+1), 0);
		if (newPosition > 0 && newPosition < 19) {
			currentPositionTine = newPosition;
		} else {
			currentPositionTine = 18;
		}
		if (currentPositionTine !== previousPositionTine) {
			// update highlight position
			tinelightPosition.set(currentPositionTine * (laneWidth+1));
			previousPositionTine = currentPositionTine;
		}
	}

	function renderHighlighter() {
		highlight = new Rect2d(0, 0, tineLabels.length * (laneWidth + 1) + (laneWidth * 2), laneWidth, true);
		tinelight = new Rect2d(0, 0, laneWidth, laneWidth, true);
	}

	function up() {
		updateOffset(4);
	}
	function down() {
		if ($offset > 0) {
			updateOffset(-4);
		}
	}
</script>

<main>
	<section tabindex={0}>
		<svg
			on:mousemove={getPosition}
			on:click={toggleNote}
			width={boardWidth}
			height={boardHeight}
		>
			<!-- tines -->
			<KalimbaTines
				{tineLabels}
				{boardHeight}
				{laneWidth}
				fillType={cFill}
			></KalimbaTines>
			<!-- bars -->
			{#each bars as bar, index}
				<rect x={0} y={index * 160}
					width={900} height={160}
					stroke="#333"
					fill-opacity="0"
				></rect>
			{/each}
			<!-- highlights -->
			{#if highlight}
				<rect {...highlight} y={$highlightPosition}
					fill="#888" stroke="#333"
					fill-opacity="0.3"
				></rect>
				<rect {...tinelight} x={$tinelightPosition} y={$highlightPosition}
					fill="#888" stroke="#FC0"
					fill-opacity="0.3"
				></rect>
			{/if}
			<!-- notes -->
			{#each $notes as note (note.id)}
				<KalimbaNote note={note} laneWidth={laneWidth} playAt={$highlightPosition} />
			{/each}
		</svg>
	</section>
	<section>
		<KalimbaControls/>
		<div>
			<button on:click={up}>Up</button>
			{$offset}
			<button on:click={down}>Down</button>
		</div>
		<div>
			<button on:click={() => cFill = true}>C Fill</button>
			<button on:click={() => cFill = false}>D/E Fill</button>
		</div>
		<div>line: {currentPosition - $offset}, tine: {currentPositionTine} x: {x}, y: {y} </div>
    	<!-- TODO: <progress value={}></progress> -->
		
		<!-- TODO: Render text notation 
		{#each $notes as note (note.id)}
			<pre class="note">{note.y}</pre>
		{/each} -->
	</section>
</main>

<GlobalStyles/>
<style>
	main {
		display: flex;
	}
	svg {
		display: block;
		background-color: #666;
		height: 100%;
	}
	.note {
		display: inline-block;
		margin: 0 4px;
	}
</style>