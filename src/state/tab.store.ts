import { writable, readable } from 'svelte/store';
import type { Tab } from '../models/tab/tab';

const initialState: Tab = {
    tempo: 120,
    name: 'untitled',
    author: 'anonymous',
    notes: [],
    offset: 0,
    playing: false,
    paused: false,
    stopped: true,
}

// this is equivalent to initialState of ngrx
// the type information is available to the consumer
export const tabStore = writable(initialState);

export const author = readable('', function auth(set) {
    return function stop() {};
});

// you can create a custom store
// as long as you expose subscribe, and leave set / update alone
// sample code from svelte tutorial:
export function createTab() {
    const { subscribe, set, update } = writable(0);

    return {
        subscribe,
        increment: () => update(n => n + 1),
        decrement: () => update(n => n - 1),
        reset: () => set(0)
    }
}