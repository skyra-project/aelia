import { Snowflake } from 'discord.js';
import { CommandStore } from 'klasa';
import { AeliaClient } from '../../lib/AeliaClient';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { MusicManager } from '../../lib/structures/MusicManager';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			description: 'Skip the current song.',
			music: ['QUEUE_NOT_EMPTY'],
			usage: '[force]'
		});
	}

	public async run(message: AeliaMessage, [force = false]: [boolean]): Promise<AeliaMessage> {
		const { music } = message.guild;

		if (music.voiceChannel.members.size > 4) {
			if (force) {
				if (!await message.hasAtLeastPermissionLevel(5)) throw 'You can\'t execute this command with the force flag. You must be at least a Moderator Member.';
			} else {
				const response = this.handleSkips(music, message.author.id);
				if (response) return message.sendMessage(response) as Promise<AeliaMessage>;
			}
		}

		await music.skip();
		return message.sendMessage(`⏭ Skipped ${music.queue[0].title}`) as Promise<AeliaMessage>;
	}

	public handleSkips(musicManager: MusicManager, user: Snowflake): string | false {
		if (!musicManager.queue[0].skips) musicManager.queue[0].skips = new Set();
		if (musicManager.queue[0].skips.has(user)) return 'You have already voted to skip this song.';
		musicManager.queue[0].skips.add(user);
		const members = musicManager.listeners.length;
		return this.shouldInhibit(members, musicManager.queue[0].skips.size);
	}

	public shouldInhibit(total: number, size: number): false | string {
		if (total <= 3) return false;

		const needed = Math.ceil(total * 0.4);
		return size >= needed ? false : `🔸 | Votes: ${size} of ${needed}`;
	}

}
