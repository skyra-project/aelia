import { MessageEmbed } from 'discord.js';
import { CommandStore } from 'klasa';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['np', 'nowplaying'],
			description: language => language.get('COMMAND_PLAYING_DESCRIPTION'),
			music: ['QUEUE_NOT_EMPTY', 'VOICE_PLAYING']
		});
	}

	public async run(message: AeliaMessage): Promise<AeliaMessage> {
		const { queue, playing } = message.guild.music;
		if (!queue.length) throw message.language.get('COMMAND_PLAYING_QUEUE_EMPTY');
		if (!playing) throw message.language.get('COMMAND_PLAYING_QUEUE_NOT_PLAYING');

		const [song] = queue;
		return message.sendMessage(new MessageEmbed()
			.setColor(12916736)
			.setTitle(song.title)
			.setURL(song.url)
			.setAuthor(song.author)
			.setDescription(message.language.get('COMMAND_PLAYING_DURATION', song.friendlyDuration))
			.setTimestamp()) as Promise<AeliaMessage>;
	}

}
