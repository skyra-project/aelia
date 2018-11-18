import { CommandStore } from 'klasa';
import { Track } from 'lavalink';
import { AeliaClient } from '../../lib/AeliaClient';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			description: 'Adds a song the the queue.',
			usage: '<url:song>'
		});
	}

	public async run(message: AeliaMessage, [songs]: [Track | Track[]]): Promise<AeliaMessage> {
		message.guild.music.add(message.author, songs);
		return message.sendMessage(Array.isArray(songs)
			? `🎵 Added **${songs.length}** songs to the queue 🎶`
			: `🎵 Added **${songs.info.title}** to the queue 🎶`) as Promise<AeliaMessage>;
	}

}
