import { MessageEmbed } from 'discord.js';
import { CommandStore } from 'klasa';
import { AeliaClient } from '../../lib/AeliaClient';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			description: 'Get information from the current song.'
		});
	}

	public async run(message: AeliaMessage): Promise<AeliaMessage> {
		const { queue, playing } = message.guild.music;
		if (!queue.length) throw `Are you speaking to me? Because my deck is empty...`;
		if (!playing) throw `I think you're listening to background noise, I'm not playing anything.`;

		const [song] = queue;
		return message.sendMessage(new MessageEmbed()
			.setColor(12916736)
			.setTitle(song.title)
			.setURL(song.url)
			.setAuthor(song.author)
			.setDescription(`**Duration**: ${song.friendlyDuration}`)
			.setTimestamp()) as Promise<AeliaMessage>;
	}

}
