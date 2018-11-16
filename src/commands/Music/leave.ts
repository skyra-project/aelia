import { CommandStore } from 'klasa';
import { AeliaClient } from '../../lib/AeliaClient';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			description: 'Leaves the voice channel.',
			music: ['AELIA_VOICE_CHANNEL', 'DJ_MEMBER', 'SAME_VOICE_CHANNEL']
		});
	}

	public async run(message: AeliaMessage): Promise<AeliaMessage> {
		await message.guild.music.leave();
		return message.sendMessage(`Successfully left the voice channel ${message.guild.me.voice.channel}`) as Promise<AeliaMessage>;
	}

}
