import { CommandStore, KlasaTextChannel, util } from 'klasa';
import { Track } from 'lavalink';
import { AeliaClient } from '../../lib/AeliaClient';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { MusicManager } from '../../lib/structures/MusicManager';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			description: 'Let\'s start the queue!',
			usage: '(song:song)'
		});

		this.createCustomResolver('song', (arg, possible, message) => {
			return arg ? this.client.arguments.get('song').run(arg, possible, message) : null;
		});
	}

	public async run(message: AeliaMessage, [songs]: [Track | Track[]]): Promise<void> {
		const { music } = message.guild;

		if (songs) {
			// If there are songs, add them
			await this.client.commands.get('add').run(message, [songs]);
		} else if (!music.queue.length) {
			await message.sendMessage(`Deck's empty my friend, add some songs to the queue with the \`${message.guild.settings.get('prefix')}add\` command so I can play them.`);
			return;
		}

		// If Aelia is not in a voice channel, join
		if (!music.voiceChannel) {
			await this.client.commands.get('join').run(message, []);
		}

		if (music.playing) {
			await message.sendMessage('Hey! The disk is already spinning!');
		} else if (music.paused) {
			music.resume();
			await message.sendMessage(`There was a track going on! Playing it back! Now playing: ${music.queue[0].title}!`);
		} else {
			music.channel = message.channel as KlasaTextChannel;
			await this.play(music);
		}
	}

	public async play(music: MusicManager): Promise<void> {
		while (music.queue.length) {
			const [song] = music.queue;
			await music.channel.send(`🎧 Playing: **${song.title}** as requested by: **${song.requester}**`);
			await util.sleep(250);

			try {
				await new Promise(music.play.bind(music));
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

}
