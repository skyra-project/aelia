const { MusicCommand, klasaUtil: { codeBlock } } = require('../../index');

module.exports = class extends MusicCommand {

	constructor(...args) {
		super(...args, {
			// Disabled until Krypton lands stable
			aliases: ['vol'],
			usage: '[control:string]',
			description: 'Manage the volume for current song.',
			extendedHelp: [
				"Let's break it down!",
				'',
				"Listen carefully, you use this command by doing either 'volume ++++' or 'volume ----'.",
				"The more '+' you write, the more the volume will increment.",
				"The more '-' you write, the more the volume will decrease.",
				'',
				'👌'
			].join('\n'),
			requireMusic: true
		});
	}

	async run(msg, [vol]) {
		const { music } = msg.guild;
		const { playing, volume } = music;
		if (!playing) throw `The party isn't going on! One shouldn't touch the volume wheel without a song first!`;

		if (!vol) return msg.sendMessage(`📢 Volume: ${volume}%`);
		if (/^[+]+$/.test(vol)) {
			if (volume >= 100) return msg.sendMessage(`📢 Volume: ${volume}%`);
			music.player.volume(Math.min(volume + (2 * (vol.split('+').length - 1)), 200));
			return msg.sendMessage(`${volume === 200 ? '📢' : '🔊'} Volume: ${volume}%`);
		}

		if (/^[-]+$/.test(vol)) {
			if (volume <= 0) return msg.sendMessage(`🔇 Volume: ${(volume)}%`);
			music.player.volume(Math.max(volume - (2 * (vol.split('-').length - 1)), 0));
			return msg.sendMessage(`${volume === 0 ? '🔇' : '🔉'} Volume: ${volume}%`);
		}

		throw `This command is quite analogic, but let me show you how you use this command:${codeBlock('', this.extendedHelp)}`;
	}

};
