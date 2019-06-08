import { CommandStore, KlasaMessage, util } from 'klasa';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { fetch } from '../../lib/util/util';
import { MessageAttachment } from 'discord.js';

export default class extends MusicCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['execute'],
			description: 'Execute commands in the terminal, use with EXTREME CAUTION.',
			guarded: true,
			permissionLevel: 10,
			usage: '<expression:string>',
			flagSupport: true
		});
	}

	public async run(message: KlasaMessage, [input]: [string]) {
		const result = await util.exec(input, { timeout: 'timeout' in message.flags ? Number(message.flags.timeout) : 60000 })
			.catch(error => ({ stdout: null, stderr: error }));
		const output = result.stdout ? `**\`OUTPUT\`**${util.codeBlock('prolog', result.stdout)}` : '';
		const outerr = result.stderr ? `**\`ERROR\`**${util.codeBlock('prolog', result.stderr)}` : '';
		const joined = [output, outerr].join('\n') || 'No output';

		return message.sendMessage(joined.length > 2000 ? await this.getHaste(joined).catch(() => new MessageAttachment(Buffer.from(joined), 'output.txt')) : joined);
	}

	public async getHaste(result: string) {
		const body = await fetch('https://hastebin.com/documents', { method: 'JSON', body: result }, 'json');
		return `https://hastebin.com/${body.key}.js`;
	}

}
