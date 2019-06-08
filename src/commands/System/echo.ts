import { MessageOptions, TextChannel } from 'discord.js';
import { CommandStore, KlasaMessage } from 'klasa';
import { MusicCommand } from '../../lib/structures/MusicCommand';

export default class extends MusicCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['talk'],
			description: 'Make Aelia talk in another channel.',
			guarded: true,
			permissionLevel: 10,
			usage: '[channel:channel] [message:string] [...]',
			usageDelim: ' '
		});
	}

	public async run(message: KlasaMessage, [channel = message.channel as TextChannel, ...content]: [TextChannel?, ...string[]]) {
		if (message.deletable) message.delete().catch(() => null);

		const attachment = message.attachments.size ? message.attachments.first()!.url : null;
		const mesContent = content.length ? content.join(' ') : '';

		if (!mesContent && !attachment) {
			throw 'I have no content nor attachment to send, please write something.';
		}

		const options: MessageOptions = {};
		if (attachment) options.files = [{ attachment }];

		await channel.send(mesContent, options);
		if (channel !== message.channel) {
			const response = await message.send(`Message successfully sent to ${channel}`) as KlasaMessage;
			response.delete({ timeout: 10000 }).catch(() => null);
		}

		return message;
	}

}
