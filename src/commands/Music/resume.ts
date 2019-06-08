import { CommandStore } from 'klasa';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: language => language.get('COMMAND_RESUME_DESCRIPTION'),
			music: ['VOICE_PAUSED', 'SAME_VOICE_CHANNEL']
		});
	}

	public async run(message: AeliaMessage): Promise<AeliaMessage> {
		await message.guild.music.resume();
		return message.sendLocale('COMMAND_RESUME_SUCCESS') as Promise<AeliaMessage>;
	}

}
