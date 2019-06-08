import { CommandStore } from 'klasa';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: language => language.get('COMMAND_REMOVE_DESCRIPTION'),
			music: ['QUEUE_NOT_EMPTY', 'SAME_VOICE_CHANNEL'],
			usage: '<number:integer>'
		});
	}

	public async run(message: AeliaMessage, [index]: [number]): Promise<AeliaMessage> {
		if (index <= 0) throw message.language.get('COMMAND_REMOVE_INDEX_INVALID');

		const { music } = message.guild;
		if (index > music.queue.length) throw message.language.get('COMMAND_REMOVE_INDEX_OUT', music.queue.length);

		index--;
		const song = music.queue[index];
		if (song.requester.id !== message.author!.id && !await message.hasAtLeastPermissionLevel(5)) {
			throw message.language.get('COMMAND_REMOVE_DENIED');
		}

		music.queue.splice(index, 1);
		return message.sendLocale('COMMAND_REMOVE_SUCCESS', [song]) as Promise<AeliaMessage>;
	}

}
