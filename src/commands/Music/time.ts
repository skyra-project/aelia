import { CommandStore } from 'klasa';
import { AeliaClient } from '../../lib/AeliaClient';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';
import { showSeconds } from '../../lib/util/util';

export default class extends MusicCommand {

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			description: 'Check how much time is left for the song to end.'
		});
	}

	public async run(message: AeliaMessage): Promise<AeliaMessage> {
		const { playing, trackRemaining } = message.guild.music;
		if (!playing) throw `Are you speaking to me? Because my deck is empty...`;
		return message.sendMessage(`🕰 Time remaining: ${showSeconds(trackRemaining)}`) as Promise<AeliaMessage>;
	}

}
