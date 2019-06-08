import { CommandStore } from 'klasa';
import { Track } from 'lavalink';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: language => language.get('COMMAND_ADD_DESCRIPTION'),
			usage: '<url:song>'
		});
	}

	public async run(message: AeliaMessage, [songs]: [Track | Track[]]): Promise<AeliaMessage> {
		message.guild.music.add(message.author!, songs);
		return message.sendMessage(Array.isArray(songs)
			? message.language.get('COMMAND_ADD_PLAYLIST', songs.length)
			: message.language.get('COMMAND_ADD_SONG', songs.info.title)) as Promise<AeliaMessage>;
	}

}
