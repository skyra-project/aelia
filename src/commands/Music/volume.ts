import { CommandStore } from 'klasa';
import { AeliaClient } from '../../lib/AeliaClient';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			aliases: ['vol'],
			description: (language) => language.get('COMMAND_VOLUME_DESCRIPTION'),
			music: ['SAME_VOICE_CHANNEL', 'VOICE_PLAYING'],
			usage: '[volume:number]'
		});
	}

	public async run(message: AeliaMessage, [volume]: [number]): Promise<AeliaMessage> {
		const { music } = message.guild;
		const previousVolume = music.volume;

		// If no argument was given
		if (typeof volume === 'undefined' || volume === previousVolume) {
			return message.sendLocale('COMMAND_VOLUME_SUCCESS', [previousVolume]) as Promise<AeliaMessage>;
		}

		// Set the volume
		await music.setVolume(volume);
		return message.sendLocale('COMMAND_VOLUME_CHANGED', [volume > previousVolume
			? (volume === 200 ? '📢' : '🔊')
			: (volume === 0 ? '🔇' : '🔉'),
			volume
		]) as Promise<AeliaMessage>;
	}

}
