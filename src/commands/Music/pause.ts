import { CommandStore } from 'klasa';
import { AeliaClient } from '../../lib/AeliaClient';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			description: 'Pauses the current song.',
			requireMusic: true
		});
	}

	public async run(message: AeliaMessage): Promise<AeliaMessage> {
		if (!message.guild.music.playing) throw 'I am not playing anything...';

		await message.guild.music.pause();
		return message.sendMessage('⏸ Paused') as Promise<AeliaMessage>;
	}

}
