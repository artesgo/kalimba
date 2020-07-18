import { onMount } from 'svelte';
import { Readable } from 'svelte/store';

const R = <T>(store: Readable<T>, callback: (value: T) => void) => {
  onMount(() => {
    return store.subscribe(callback);
  });
};

function truncator(numToTruncate, intDecimalPlaces) {    
  var numPower = Math.pow(10, intDecimalPlaces);
  return ~~(numToTruncate * numPower)/numPower;
}

export { R, truncator };