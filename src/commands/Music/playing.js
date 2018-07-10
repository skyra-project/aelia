const { MusicCommand } = require('../../index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends MusicCommand {

	constructor(...args) {
		super(...args, { description: 'Get information from the current song.' });
	}

	async run(msg) {
		const { queue, playing } = msg.guild.music;
		if (!playing) throw `Are you speaking to me? Because my deck is empty...`;

		const [song] = queue;
		return msg.sendMessage(new MessageEmbed()
			.setColor(12916736)
			.setTitle(song.title)
			.setURL(song.url)
			.setAuthor(song.author)
			.setDescription(`**Duration**: ${song.friendlyDuration}`)
			.setTimestamp());
	}

};
