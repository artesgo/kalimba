<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    function set16() {
		    dispatch('duration', { duration: 1 });
    }
    function set8() {
		    dispatch('duration', { duration: 2 });
    }
    function set4() {
		    dispatch('duration', { duration: 4 });
    }
    function set2() {
		    dispatch('duration', { duration: 8 });
    }
    function setNote() {
		    dispatch('duration', { duration: 16 });
    }
</script>

<section>
    <button on:click={set16}>16th</button>
    <button on:click={set8} >8th</button>
    <button on:click={set4} >Quarter</button>
    <button on:click={set2} >Half</button>
    <button on:click={setNote}>Whole</button>
</section>