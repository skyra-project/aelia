const { MusicCommand } = require('../../index');

module.exports = class extends MusicCommand {

	constructor(...args) {
		super(...args, {
			description: 'Prune the queue list.',
			requireMusic: true
		});
	}

	async run(msg) {
		const { music } = msg.guild;

		if (music.voiceChannel.members.size > 4)
			if (!await msg.hasAtLeastPermissionLevel(5)) throw 'You can\'t execute this command when there are over 4 members. You must be at least a Dj Member.';

		const amount = music.queue.length;
		const first = music.queue.shift();
		music.prune();
		music.queue[0] = first;
		return msg.sendMessage(`🗑 Pruned ${amount} songs.`);
	}

};
