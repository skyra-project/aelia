import nodeFetch, { RequestInit, Response } from 'node-fetch';
import { URL } from 'url';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

/**
 * Show time duration in an un-trimmed h:mm:ss format.
 * @param duration Duration in milliseconds.
 */
export function showSeconds(duration: number): string {
	const seconds = Math.floor(duration / SECOND) % 60;
	if (duration < MINUTE) return seconds === 1 ? 'a second' : `${seconds} seconds`;

	const minutes = Math.floor(duration / MINUTE) % 60;
	let output = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	if (duration >= HOUR) {
		const hours = Math.floor(duration / HOUR);
		output = `${hours.toString().padStart(2, '0')}:${output}`;
	}

	return output;
}

/**
 * @enumerable decorator that sets the enumerable property of a class field to false.
 * @param value true|false
 */
export function enumerable(value: boolean): (target: any, propertyKey: string) => void {
	return (target, key): void => {
		Object.defineProperty(target, key, {
			enumerable: value,
			set(this: any, val: any): void {
				// tslint:disable-next-line
				Object.defineProperty(this, key, {
					configurable: true,
					enumerable: value,
					value: val,
					writable: true
				});
			}
		});
	};
}

export async function fetch(url: URL | string, type: 'json'): Promise<any>;
export async function fetch(url: URL | string, options: RequestInit, type: 'json'): Promise<any>;
export async function fetch(url: URL | string, type: 'buffer'): Promise<Buffer>;
export async function fetch(url: URL | string, options: RequestInit, type: 'buffer'): Promise<Buffer>;
export async function fetch(url: URL | string, type: 'text'): Promise<string>;
export async function fetch(url: URL | string, options: RequestInit, type: 'text'): Promise<string>;
export async function fetch(url: URL | string, type: 'result'): Promise<Response>;
export async function fetch(url: URL | string, options: RequestInit, type: 'result'): Promise<Response>;
export async function fetch(url: URL | string, options: RequestInit, type: 'result' | 'json' | 'buffer' | 'text'): Promise<Response | Buffer | string | any>;
export async function fetch(url: URL | string, options: RequestInit | 'result' | 'json' | 'buffer' | 'text', type?: 'result' | 'json' | 'buffer' | 'text'): Promise<any> {
	if (typeof options === 'undefined') {
		options = {};
		type = 'json';
	} else if (typeof options === 'string') {
		type = options;
		options = {};
	} else if (typeof type === 'undefined') {
		type = 'json';
	}

	// @ts-ignore
	const result: Response = await nodeFetch(url, options);
	if (!result.ok) throw result.status;

	switch (type) {
		case 'result': return result;
		case 'buffer': return result.buffer();
		case 'json': return result.json();
		case 'text': return result.text();
		default: throw new Error(`Unknown type ${type}`);
	}
}
