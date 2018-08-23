const { MusicCommand, klasaUtil: { sleep } } = require('../../index');

module.exports = class extends MusicCommand {

	constructor(...args) {
		super(...args, { description: 'Let\'s start the queue!' });
	}

	async run(msg) {
		const { music } = msg.guild;

		if (!music.queue.length)
			return msg.sendMessage(`Deck's empty my friend, add some songs to the queue with the \`${msg.guild.settings.prefix}add\` command so I can play them.`);

		if (!music.voiceChannel) await this.store.get('join').run(msg);

		if (music.playing) {
			return msg.sendMessage('Hey! The disk is already spinning!');
		} else if (music.paused) {
			music.resume();
			return msg.sendMessage(`There was a track going on! Playing it back! Now playing: ${music.queue[0].title}!`);
		} else {
			music.channel = msg.channel;
			music.playing = true;
			return this.play(music);
		}
	}

	async play(music) {
		while (music.queue.length) {
			const [song] = music.queue;
			await music.channel.send(`🎧 Playing: **${song.title}** as requested by: **${song.requester}**`);
			await sleep(250);

			try {
				if (!await new Promise(async (resolve) => {
					(await music.play())
						.once('end', () => {
							music.skip();
							resolve(true);
						})
						.once('error', (err) => {
							music.channel.send('Whoops! This disk broke!');
							music.client.emit('error', err);
							music.skip();
							resolve(true);
						})
						.once('disconnect', () => {
							resolve(false);
						});
				})) return;

				// Autofetch if the autoplayer is enabled
				// if (!music.queue.length && music.autoplay) await this.autoPlayer(music);
			} catch (error) {
				if (typeof error !== 'string') this.client.emit('error', error);
				music.channel.send(error);
				music.leave();
				break;
			}
		}

		if (!music.queue.length) {
			await music.channel.send('⏹ From 1 to 10, being 1 the worst score and 10 the best, how would you rate the session? It just ended!');
			music.leave();
		}
	}

	// autoPlayer(music) {
	// 	return music.add('YouTube AutoPlay', music.next);
	// }

};
