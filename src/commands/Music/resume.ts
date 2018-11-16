import { CommandStore } from 'klasa';
import { AeliaClient } from '../../lib/AeliaClient';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			description: 'Resumes the current song.',
			requireMusic: true
		});
	}

	public async run(message: AeliaMessage): Promise<AeliaMessage> {
		if (!message.guild.music.playing) throw 'My deck is empty! Give me a disk first so I can lift the spirits in this room!';
		if (!message.guild.music.paused) throw 'Is this song too silent, my friend? Because it is indeed... playing.';

		await message.guild.music.resume();
		return message.sendMessage('▶ Resumed') as Promise<AeliaMessage>;
	}

}
