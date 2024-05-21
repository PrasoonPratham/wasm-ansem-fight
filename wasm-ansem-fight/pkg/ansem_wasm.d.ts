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

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly render: (a: number, b: number, c: number) => number;
  readonly __wbg_workerpool_free: (a: number) => void;
  readonly workerpool_new: (a: number) => void;
  readonly task_worker_entry_point: (a: number, b: number) => void;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hdae13ca0b8166526: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h3c7af5fecd29d36e: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h8f904e7a3fcaa7d2: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h85553e9d3fa25a29: (a: number, b: number, c: number, d: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
