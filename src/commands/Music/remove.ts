import { CommandStore } from 'klasa';
import { AeliaClient } from '../../lib/AeliaClient';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			description: 'Remove a song from the queue list.',
			requireMusic: true,
			usage: '<number:integer>'
		});
	}

	public async run(message: AeliaMessage, [index]: [number]): Promise<AeliaMessage> {
		if (index <= 0) throw 'Look, I am no expert in maths, but I kinda expected a number equal or bigger than 1...';

		const { music } = message.guild;
		if (index > music.queue.length) throw `I tried getting that song for you, but I only have ${music.queue.length} songs in my deck!`;

		index--;
		const song = music.queue[index];
		if (song.requester.id !== message.author.id && !await message.hasAtLeastPermissionLevel(5)) {
			throw DENIED_SONG_REMOVAL;
		}

		music.queue.splice(index, 1);
		return message.sendMessage(`🗑 Removed the song **${song.title}** requested by **${song.requester}**.`) as Promise<AeliaMessage>;
	}

}

// The next line is too long to fit above
const DENIED_SONG_REMOVAL = [
	'I find it a bit rude to remove somebody else\'s songs from the list... Talk with them kindly, or',
	'shout at a DJ if there is one in this guild, if it ruins the party, then they may consider to remove it!'
].join(' ');
