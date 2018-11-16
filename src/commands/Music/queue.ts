import { CommandStore } from 'klasa';
import { AeliaClient } from '../../lib/AeliaClient';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			description: 'Check the queue list.',
			music: ['QUEUE_NOT_EMPTY']
		});
	}

	public async run(message: AeliaMessage): Promise<AeliaMessage> {
		const { queue } = message.guild.music;
		if (!queue.length) throw 'The queue is empty! You can add some songs using `Aelia, add`.';

		const output = [];
		for (let i = 0; i < Math.min(queue.length, 10); i++) {
			const song = queue[i];
			output[i] = [
				`[__\`${String(i + 1).padStart(2, '0')}\`__] *${song.title.replace(/\*/g, '\\*')}* requested by **${song.requester.tag}**`,
				`   └── <${song.url}> (${song.friendlyDuration})`
			].join('\n');
		}
		if (queue.length > 10) output.push(`\nShowing 10 songs of ${queue.length}`);

		return message.sendMessage(output.join('\n')) as Promise<AeliaMessage>;
	}

}
