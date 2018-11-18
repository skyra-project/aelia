import { MessageOptions } from 'discord.js';
import { CommandStore, KlasaTextChannel } from 'klasa';
import { AeliaClient } from '../../lib/AeliaClient';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			aliases: ['talk'],
			description: 'Make Aelia talk in another channel.',
			permissionLevel: 10,
			usage: '[channel:channel] [message:...string]',
			usageDelim: ' '
		});
	}

	public async run(message: AeliaMessage, [channel = message.channel as KlasaTextChannel, content]: [KlasaTextChannel, string]): Promise<AeliaMessage> {
		if (message.deletable) message.delete().catch(() => null);

		const attachment = message.attachments.size > 0 ? message.attachments.first().url : null;
		if (content.length === 0 && !attachment) throw 'I have no content nor attachment to send, please write something.';

		const options: MessageOptions = {};
		if (attachment) options.files = [{ attachment }];

		return channel.send(content, options) as Promise<AeliaMessage>;
	}

}
