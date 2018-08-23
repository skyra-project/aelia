const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, { spamProtection: true });
	}

	async run(msg, cmd) {
		if (cmd.requireMusic !== true) return;

		if (msg.channel.type !== 'text') throw 'This command may be only executed in a server.';

		const [memberChannel, sneyraChannel] = [msg.member.voice.channelID, msg.guild.me.voice.channelID];
		if (!memberChannel) throw 'You are not connected in a voice channel.';
		if (!sneyraChannel) throw 'I am not connected in a voice channel.';
		if (memberChannel !== sneyraChannel) throw 'You must be in the same voice channel as me.';
	}

};
