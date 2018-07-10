const { MusicCommand } = require('../../index');

module.exports = class extends MusicCommand {

	constructor(...args) {
		super(...args, {
			description: 'Adds a song the the queue.',
			usage: '<url:song>'
		});
	}

	async run(msg, [songs]) {
		if (Array.isArray(songs)) {
			for (const song of songs) msg.guild.music.add(msg.author, song);
			return msg.sendMessage(`🎵 Added **${songs.length}** songs to the queue 🎶`);
		}
		msg.guild.music.add(msg.author, songs);
		return msg.sendMessage(`🎵 Added **${songs.info.title}** to the queue 🎶`);
	}

};
