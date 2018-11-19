import { CommandStore } from 'klasa';
import { AeliaClient } from '../../lib/AeliaClient';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			description: (language) => language.get('COMMAND_PAUSE_DESCRIPTION'),
			music: ['VOICE_PLAYING', 'SAME_VOICE_CHANNEL']
		});
	}

	public async run(message: AeliaMessage): Promise<AeliaMessage> {
		await message.guild.music.pause();
		return message.sendLocale('COMMAND_PAUSE_SUCCESS') as Promise<AeliaMessage>;
	}

}
