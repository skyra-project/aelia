import { CommandStore, util } from 'klasa';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['execute'],
			description: 'Execute commands in the terminal, use with EXTREME CAUTION.',
			guarded: true,
			permissionLevel: 10,
			usage: '<expression:string>'
		});
	}

	public async run(message: AeliaMessage, [input]: [string]): Promise<AeliaMessage> {
		const result = await util.exec(input, { timeout: 'timeout' in message.flags ? Number(message.flags.timeout) : 60000 })
			.catch(error => ({ stdout: null, stderr: error }));
		const output = result.stdout ? `**\`OUTPUT\`**${util.codeBlock('prolog', result.stdout)}` : '';
		const outerr = result.stderr ? `**\`ERROR\`**${util.codeBlock('prolog', result.stderr)}` : '';

		return message.sendMessage([output, outerr].join('\n') || 'No Output') as Promise<AeliaMessage>;
	}

}
