const { Argument } = require('klasa');
const { parse } = require('url');

module.exports = class extends Argument {

	async run(arg, possible, msg) {
		if (!msg.guild) return null;

		arg = arg.replace(/<(.+)>/g, '$1');
		if (this.isLink(arg))
			return this.client.lavalink.resolveTracks(arg);

		const searchSoundcloud = 'sc' in msg.flags || 'soundcloud' in msg.flags;

		if (!searchSoundcloud) {
			const tracks = await this.client.lavalink.resolveTracks(`ytsearch: ${arg}`);
			if (!tracks.length) tracks.push(...await this.client.lavalink.resolveTracks(`scsearch: ${arg}`));
			if (!tracks.length) throw `Could not find any results for \`${arg}\``;
			return tracks[0];
		}

		const tracks = await this.client.lavalink.resolveTracks(`scsearch: ${arg}`);
		if (!tracks.length) throw `Could not find any results for \`${arg}\``;
		return tracks[0];
	}

	isLink(url) {
		const res = parse(url);
		return res.protocol && res.hostname && (res.protocol === 'https:' || res.protocol === 'http:');
	}

};
