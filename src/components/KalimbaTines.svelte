<script lang="typescript">
    import { Rect2d } from "../models/shapes/rect2d";
    import { afterUpdate } from "svelte";

    export let tineLabels;
    export let laneWidth;
    export let boardHeight;
	export let fillType;
	
    let tines = [];
    afterUpdate(() => {
		createTines();
    });

	function cFill(index) {
		if ([2,5,8,11,14].indexOf(index) > -1) {
			return '#8A8';
		} else {
			return '#888';
		}
	}

	function deFill(index) {
		if ([1,4,7,9,12,15].indexOf(index) > -1) {
			return '#8A8';
		} else {
			return '#888';
		}
    }

	function createTines() {
        tines = [];
		for (let i = 1; i <= tineLabels.length; i++) {
			let item = new Rect2d(((laneWidth + 1) * i), 0, laneWidth, boardHeight, true);
			tines = [ ...tines, item ];
		}
	}
</script>
{#if fillType}
	{#each tines as item, index}
		<rect {...item}
			fill={cFill(index)}
		>
		</rect>
	{/each}
{:else if !fillType}
	{#each tines as item, index}
		<rect {...item}
			fill={deFill(index)}
		>
		</rect>
	{/each}
{/if}