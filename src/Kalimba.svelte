<script lang="typescript">

	import GlobalStyles from './components/GlobalStyles.svelte';
	import KalimbaControls from './components/KalimbaControls.svelte';
	import KalimbaNote from './components/KalimbaNote.svelte';

	import { onMount } from 'svelte';
	import { tweened, spring } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import { scale } from 'svelte/transition';
	import { cubicOut, linear } from 'svelte/easing';
	import { truncator } from './utils/utils';

	import { Note } from './models/tab/note';
	import { Arc2d } from './models/shapes/arc2d';
	import { Rect2d } from './models/shapes/rect2d';
 	import { Object2d } from './models/shapes/object2d';

	import { progress, notes, offset } from './state/tab.selectors';
	import { insertNote, updateOffset } from './state/tab.facade';

	let clicks = 0;
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

	const tineLabels = ['d3', 'b2', 'g2', 'e2', 'c2', 'a1', 'f1', 'd1', 'c1', 'e1', 'g1', 'b1', 'd2', 'f2', 'a2', 'c3', 'e3'];

	let boardHeight = 600;
	let laneWidth = 20;
	let noteRadius = laneWidth / 2 - 2;
	let boardWidth = (laneWidth + 1) * tineLabels.length + 40;
	let noteLength = 4;
	let pieceDuration = 6000;

	onMount(() => {
		renderTines();
		renderHighlighter();
	});

	// note management
	function hasNote(x, y): boolean {
		// check note array based on curr position
		return false;
	}

	function toggleNote(): void {
		// let note = new Arc2d(31, 24, noteRadius, true);
		// notes = [ ...notes, note ];
		if (currentPositionTine > 0 && currentPositionTine <= tineLabels.length) {
			if (!hasNote(currentPositionTine, currentPosition)) {
				// TODO: currentPosition needs offset when going through the song
				let note = new Note(
					currentPositionTine,
					currentPosition + $offset,
					noteRadius, true);
				note.name = tineLabels[currentPositionTine - 1];
				insertNote(note);
			}
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

	function getTineFill(index) {
		// control structures
		if ((index + 1) % 3 === 0) {
			return '#8A8';
		} else {
			return '#888';
		}
	}

	let yPosition = [];
	function getNoteX(note: Note): number {
		return note.x*(laneWidth+1) + 10;
	}

	function getNoteY(note: Note) {
		return note.y*laneWidth + 10;
	}
	function up() {
		updateOffset(16);
	}
	function down() {
		if ($offset > 0) {
			updateOffset(-16);
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
			<KalimbaNote note={note} laneWidth={laneWidth} />
		{/each}
	</svg>
	<section>
		<KalimbaControls/>
		<div>
			<button on:click={up}>Up</button>
			{$offset}
			<button on:click={down}>Down</button>
		</div>
		<div>line: {currentPosition}, tine: {currentPositionTine} x: {x}, y: {y} </div>
    	<progress value={$progress}></progress>


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
</style>