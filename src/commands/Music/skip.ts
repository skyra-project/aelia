import { Snowflake } from 'discord.js';
import { CommandStore } from 'klasa';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { MusicManager } from '../../lib/structures/MusicManager';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: language => language.get('COMMAND_SKIP_DESCRIPTION'),
			music: ['QUEUE_NOT_EMPTY'],
			usage: '[force]'
		});
	}

	public async run(message: AeliaMessage, [force = false]: [boolean]): Promise<AeliaMessage> {
		const { music } = message.guild;

		if (music.voiceChannel.members.size > 4) {
			if (force) {
				if (!await message.hasAtLeastPermissionLevel(5)) throw message.language.get('COMMAND_SKIP_PERMISSIONS');
			} else {
				const response = this.handleSkips(music, message.author!.id);
				if (response) return message.sendMessage(response) as Promise<AeliaMessage>;
			}
		}

		await music.skip();
		return message.sendLocale('COMMAND_SKIP_SUCCESS', [music.queue[0].title]) as Promise<AeliaMessage>;
	}

	public handleSkips(musicManager: MusicManager, user: Snowflake): string | false {
		if (!musicManager.queue[0].skips) musicManager.queue[0].skips = new Set();
		if (musicManager.queue[0].skips.has(user)) return musicManager.guild.language.get('COMMAND_SKIP_VOTES_VOTED');
		musicManager.queue[0].skips.add(user);
		const members = musicManager.listeners.length;
		return this.shouldInhibit(musicManager, members, musicManager.queue[0].skips.size);
	}

	public shouldInhibit(musicManager: MusicManager, total: number, size: number): false | string {
		if (total <= 3) return false;

		const needed = Math.ceil(total * 0.4);
		return size >= needed ? false : musicManager.guild.language.get('COMMAND_SKIP_VOTES_TOTAL', size, needed);
	}

}
