const { PlayerManager } = require('discord.js-lavalink');
const { lavalink: { BASE_URL, PORT_REST, AUTHORIZATION } } = require('../../../config');
const fetch = require('node-fetch');

class LavalinkClient extends PlayerManager {

	/**
     * Search for tracks from lavalink rest api
     * @param {string} search Search query
     * @returns {Promise<?Array<Object>>}
     */
	async resolveTracks(search) {
		const url = new URL(`https://${BASE_URL}:${PORT_REST}`);
		url.search = new URLSearchParams([['identifier', search]]);

		const result = await fetch(url, { headers: { Authorization: AUTHORIZATION } });
		return result.ok ? result.json() : [];
	}

}

module.exports = LavalinkClient;
