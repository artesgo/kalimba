<script lang="typescript">
	import GlobalStyles from './components/GlobalStyles.svelte';
	import KalimbaControls from './components/KalimbaControls.svelte';
	import KalimbaNote from './components/KalimbaNote.svelte';

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

	let tines: Rect2d[] = [];
	let highlight: Rect2d;
	let tinelight: Rect2d;
	let currentPosition = 0;
	let previousPosition = 0;
	let currentPositionTine = 0;
	let previousPositionTine = 0;
	const highlightPosition = tweened(0, {
		duration: 500,
		easing: cubicOut
	});
	const tinelightPosition = tweened(0, {
		duration: 500,
		easing: cubicOut
	});

	const tineLabels = ['d6', 'b5', 'g5', 'e5', 'c5', 'a4', 'f4', 'd4', 'c4', 'e4', 'g4', 'b4', 'd5', 'f5', 'a5', 'c6', 'e6'];

	const boardHeight = 600;
	const laneWidth = 20;
	const noteRadius = laneWidth / 2 - 2;
	const boardWidth = (laneWidth + 1) * tineLabels.length + 40;
	const noteLength = 4;

	const subs = [];
	onMount(() => {
		renderTines();
		renderHighlighter();

		// 
		subs.push(playback.subscribe((_playback) => {
			if (_playback.playing) {
				let [first] = $notes;
				highlightPosition.set(first.y * 20);
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
		highlight = new Rect2d(0, 0, tineLabels.length * 21 + 40, laneWidth, true);
		tinelight = new Rect2d(0, 0, 20, laneWidth, true);
	}

	// tines
	function renderTines() {
		for (let i = 1; i <= tineLabels.length; i++) {
			let item = new Rect2d((21 * i), 0, laneWidth, boardHeight, true);
			tines = [ ...tines, item ];
		}
	}

	let _fillC = true;
	function fill(c: boolean) {
		_fillC = c;
		renderTines();
	}
	function getTineFill(index) {
		if (_fillC) {
			return cFill(index);
		} else {
			return deFill(index);
		}
	}

	function cFill(index) {
		if ((index + 1) % 3 === 0) {
			return '#8A8';
		} else {
			return '#888';
		}
	}

	function deFill(index) {
		if ((index < 10 && (index - 1) % 3 === 0) || (index > 8 && index % 3 === 0)) {
			return '#8A8';
		} else {
			return '#888';
		}
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
	<svg
		on:mousemove={getPosition}
		on:click={toggleNote}
		width={boardWidth}
		height={boardHeight}
	>
		<!-- tines -->
		{#each tines as item, index}
			<rect {...item}
				fill={getTineFill(index)}
			>
			</rect>
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
	<section>
		<KalimbaControls/>
		<div>
			<button on:click={up}>Up</button>
			{$offset}
			<button on:click={down}>Down</button>
		</div>
		<div>
			<!-- TODO: Change Fill Types -->
			<button on:click={() => fill(true)}>C Fill</button>
			<button on:click={() => fill(false)}>D/E Fill</button>
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