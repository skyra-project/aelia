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
	return function(target: any, propertyKey: string): void {
		const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
		if (descriptor.enumerable !== value) {
			descriptor.enumerable = value;
			Object.defineProperty(target, propertyKey, descriptor);
		}
	};
}
