import { CommandStore, KlasaTextChannel, util } from 'klasa';
import { Track } from 'lavalink';
import { AeliaClient } from '../../lib/AeliaClient';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { MusicManager } from '../../lib/structures/MusicManager';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			description: (language) => language.get('COMMAND_PLAY_DESCRIPTION'),
			music: ['USER_VOICE_CHANNEL'],
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
			await message.sendLocale('COMMAND_PLAY_QUEUE_EMPTY', [message.guild.settings.get('prefix')]);
			return;
		}

		// If Aelia is not in a voice channel, join
		if (!music.voiceChannel) {
			await this.client.commands.get('join').run(message, []);
		}

		if (music.playing) {
			await message.sendLocale('COMMAND_PLAY_QUEUE_PLAYING');
		} else if (music.paused) {
			await music.resume();
			await message.sendLocale('COMMAND_PLAY_QUEUE_PAUSED', [music.queue[0].title]);
		} else {
			music.channel = message.channel as KlasaTextChannel;
			this.play(music).catch((error) => this.client.emit('wtf', error));
		}
	}

	public async play(music: MusicManager): Promise<void> {
		while (music.queue.length) {
			const [song] = music.queue;
			await music.channel.sendLocale('COMMAND_PLAY_NEXT', [song]);
			await util.sleep(250);

			try {
				await music.play();
			} catch (error) {
				if (typeof error !== 'string') this.client.emit('error', error);
				await music.channel.send(error);
				await music.leave();
				break;
			}
		}

		if (!music.queue.length) {
			await music.channel.sendLocale('COMMAND_PLAY_END');
			await music.leave().catch((error) => { this.client.emit('wtf', error); });
		}
	}

}
