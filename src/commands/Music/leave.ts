import { CommandStore } from 'klasa';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: language => language.get('COMMAND_LEAVE_DESCRIPTION'),
			music: ['AELIA_VOICE_CHANNEL', 'DJ_MEMBER', 'SAME_VOICE_CHANNEL']
		});
	}

	public async run(message: AeliaMessage): Promise<AeliaMessage> {
		await message.guild.music.leave();
		return message.sendLocale('COMMAND_LEAVE_SUCCESS', [message.guild.me!.voice.channel]) as Promise<AeliaMessage>;
	}

}
