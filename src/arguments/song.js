const { Argument } = require('klasa');

module.exports = class extends Argument {

	async run(arg, possible, msg) {
		if (!msg.guild) return null;

		arg = arg.replace(/<(.+)>/g, '$1');
		const parsedURL = this.parseURL(arg);
		if (parsedURL) {
			const tracks = await this.client.lavalink.resolveTracks(arg);
			if (!tracks.length) throw `Could not find any results for \`${arg}\``;
			return parsedURL.playlist ? tracks : tracks[0];
		}

		if (!(('sc' in msg.flags) || ('soundcloud' in msg.flags))) {
			const tracks = await this.client.lavalink.resolveTracks(`ytsearch: ${arg}`);
			if (!tracks.length) tracks.push(...await this.client.lavalink.resolveTracks(`scsearch: ${arg}`));
			if (!tracks.length) throw `Could not find any results for \`${arg}\``;
			return tracks[0];
		}

		const tracks = await this.client.lavalink.resolveTracks(`scsearch: ${arg}`);
		if (!tracks.length) throw `Could not find any results for \`${arg}\``;
		return tracks[0];
	}

	parseURL(url) {
		try {
			const parsed = new URL(url);
			return parsed.protocol && parsed.hostname && (parsed.protocol === 'https:' || parsed.protocol === 'http:')
				? { url: parsed.href, playlist: parsed.searchParams.has('list') }
				: null;
		} catch (error) {
			return null;
		}
	}

};
