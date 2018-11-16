import { CommandStore } from 'klasa';
import { AeliaClient } from '../../lib/AeliaClient';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';

export default class extends MusicCommand {

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			// Disabled until Krypton lands stable
			aliases: ['vol'],
			description: 'Manage the volume for current song.',
			requireMusic: true,
			usage: '[volume:number]'
		});
	}

	public async run(message: AeliaMessage, [volume]: [number]): Promise<AeliaMessage> {
		const { music } = message.guild;
		if (!music.playing) throw `The party isn't going on! One shouldn't touch the volume wheel without a song first!`;

		const previousVolume = music.volume;

		// If no argument was given
		if (typeof volume === 'undefined' || volume === previousVolume) {
			return message.sendMessage(`📢 Volume: ${previousVolume}%`) as Promise<AeliaMessage>;
		}

		// Set the volume
		await music.setVolume(volume);
		return message.sendMessage(volume > previousVolume
			? `${volume === 200 ? '📢' : '🔊'} Volume: ${volume}%`
			: `${volume === 0 ? '🔇' : '🔉'} Volume: ${volume}%`) as Promise<AeliaMessage>;
	}

}
