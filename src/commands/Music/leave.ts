import { CommandStore } from 'klasa';
import { AeliaClient } from '../../lib/AeliaClient';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			description: 'Leaves the voice channel.',
			requireMusic: true
		});
	}

	public async run(message: AeliaMessage): Promise<AeliaMessage> {
		if (!message.guild.music.voiceChannel) {
			throw `Beg your pardon? I don't think I'm in a voice channel.`;
		}
		if (message.guild.music.dj && message.author.id !== message.guild.music.dj) {
			throw `Hey, don't touch that! ${message.guild.music.djUser.username} is in charge of the party!`;
		}

		await message.guild.music.leave();
		return message.sendMessage(`Successfully left the voice channel ${message.guild.me.voice.channel}`) as Promise<AeliaMessage>;
	}

}
