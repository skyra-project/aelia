import { Event, EventStore } from 'klasa';
import { AeliaGuild } from '../lib/extensions/AeliaGuild';

export default class extends Event {

	public constructor(store: EventStore, file: string[], directory: string) {
		super(store, file, directory, {
			emitter: 'lavalink',
			event: 'destroy'
		});
	}

	public run(payload: any) {
		if (!payload.guildId) return;
		try {
			const guild = this.client.guilds.get(payload.guildId);
			if (guild) (guild as AeliaGuild).music.receiver(payload);
		} catch (error) {
			this.client.emit('wtf', error);
		}
	}

}
