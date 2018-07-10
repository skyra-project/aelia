const { MusicCommand } = require('../../index');

module.exports = class extends MusicCommand {

	constructor(...args) {
		super(...args, { description: 'Check the queue list.' });
	}

	async run(msg) {
		const { queue } = msg.guild.music;
		const output = [];
		for (let i = 0; i < Math.min(queue.length, 10); i++) {
			const song = queue[i];
			output[i] = [
				`[__\`${String(i + 1).padStart(2, 0)}\`__] *${song.title.replace(/\*/g, '\\*')}* requested by **${song.requester.tag}**`,
				`   └── <${song.url}> (${song.friendlyDuration})`
			].join('\n');
		}
		if (queue.length > 10) output.push(`\nShowing 10 songs of ${queue.length}`);
		// else if (autoplay) output.push(`\n**AutoPlay**: <${next}>`);

		return msg.sendMessage(output.join('\n'));
	}

};
