/* tslint:disable */
/* eslint-disable */
/**
* @param {string} player
* @param {number} wif
* @returns {Promise<number>}
*/
export function render(player: string, wif: number): Promise<number>;
/**
* Entry point invoked by JavaScript in a worker.
* @param {number} ptr
*/
export function task_worker_entry_point(ptr: number): void;
/**
*/
export class WorkerPool {
  free(): void;
/**
* Creates a new `WorkerPool` which immediately creates `initial` workers.
*
* The pool created here can be used over a long period of time, and it
* will be initially primed with `initial` workers. Currently workers are
* never released or gc'd until the whole pool is destroyed.
*
* # Errors
*
* Returns any error that may happen while a JS web worker is created and a
* message is sent to it.
*/
  constructor();
}
