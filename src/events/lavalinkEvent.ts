import { Event, EventStore } from 'klasa';
import { AeliaClient } from '../lib/AeliaClient';
import { AeliaGuild } from '../lib/extensions/AeliaGuild';

export default class extends Event {

	public constructor(client: AeliaClient, store: EventStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			emitter: client.lavalink,
			event: 'event'
		});
	}

	public run(payload: any): void {
		if (!payload.guildId) return;
		try {
			const guild = this.client.guilds.get(payload.guildId);
			if (guild) (guild as AeliaGuild).music.receiver(payload);
		} catch (error) {
			this.client.emit('wtf', error);
		}
	}

}
