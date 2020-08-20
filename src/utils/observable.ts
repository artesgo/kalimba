import { Observable, Subject } from 'rxjs';
import type { Readable } from 'svelte/store';

export function toObservable<T>(readable: Readable<T>): Observable<T> {
    let subject = new Subject<T>();
    readable.subscribe((data) => {
        subject.next(data);
    })
    return subject;
}