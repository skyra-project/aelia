const { showSeconds } = require('../util/util');

class Song {

	/**
	 * @typedef {Object} SongDataInfo
	 * @property {string} identifier
	 * @property {boolean} isSeekable
	 * @property {string} author
	 * @property {number} length
	 * @property {number} isStream
	 * @property {number} position
	 * @property {string} title
	 * @property {string} uri
	 */

	/**
	 * @typedef {Object} SongData
	 * @property {string} track
	 * @property {SongDataInfo} info
	 */

	/**
	 * @param {SongData} data The retrieved data
	 * @param {KlasaUser} requester The user that requested this song
	 */
	constructor(data, requester) {
		Object.defineProperty(this, 'track', { value: data.track });
		Object.defineProperty(this, 'requester', { value: requester });

		this.identifier = data.info.identifier;
		this.seekable = data.info.isSeekable;
		this.author = data.info.author;
		this.duration = data.info.length;
		this.stream = data.info.stream;
		this.position = data.info.position;
		this.title = data.info.title;
		this.url = data.info.uri;
		this.skips = new Set();
	}

	get friendlyDuration() {
		return showSeconds(this.duration);
	}

	toString() {
		return `Song<${this.url}>`;
	}

}

module.exports = Song;
