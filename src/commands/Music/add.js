const { MusicCommand } = require('../../index');

module.exports = class extends MusicCommand {

	constructor(...args) {
		super(...args, {
			description: 'Adds a song the the queue.',
			usage: '<url:song>'
		});
	}

	async run(msg, [song]) {
		msg.guild.music.add(msg.author, song);
		return msg.sendMessage(`🎵 Added **${song.info.title}** to the queue 🎶`);
	}

};
