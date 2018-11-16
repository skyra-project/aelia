import { CommandStore } from 'klasa';
import { AeliaClient } from '../../lib/AeliaClient';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			description: 'Prune the queue list.',
			music: ['QUEUE_NOT_EMPTY']
		});
	}

	public async run(message: AeliaMessage): Promise<AeliaMessage> {
		const { music } = message.guild;

		if (music.voiceChannel.members.size > 4 && !await message.hasAtLeastPermissionLevel(5)) {
			throw `You can't execute this command when there are over 4 members! You must be the Dj of this party!`;
		}

		const amount = music.queue.length;
		const first = music.queue.shift();
		music.prune();
		music.queue[0] = first;
		return message.sendMessage(`🗑 Pruned ${amount} songs.`) as Promise<AeliaMessage>;
	}

}
