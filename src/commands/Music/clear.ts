import { CommandStore } from 'klasa';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: language => language.get('COMMAND_CLEAR_DESCRIPTION'),
			music: ['QUEUE_NOT_EMPTY']
		});
	}

	public async run(message: AeliaMessage): Promise<AeliaMessage> {
		const { music } = message.guild;

		if (music.voiceChannel.members.size > 4 && !await message.hasAtLeastPermissionLevel(5)) {
			throw message.language.get('COMMAND_CLEAR_DENIED');
		}

		const amount = music.queue.length;
		const first = music.queue.shift()!;
		music.prune();
		music.queue[0] = first;
		return message.sendLocale('COMMAND_CLEAR_SUCCESS', [amount]) as Promise<AeliaMessage>;
	}

}
