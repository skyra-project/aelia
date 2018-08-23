const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

class Util {

	/**
     * Show time duration in an un-trimmed h:mm:ss format.
     * @param {number} duration Duration in milliseconds.
     * @returns {string}
     */
	static showSeconds(duration) {
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

}

module.exports = Util;
