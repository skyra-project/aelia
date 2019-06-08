import { Structures } from 'discord.js';
import { KlasaGuild } from 'klasa';
import { Queue } from '../structures/music/Queue';

export class AeliaGuild extends KlasaGuild {

	/**
	 * The MusicManager instance for this client
	 */
	public readonly music: Queue = new Queue(this);

}

Structures.extend('Guild', () => AeliaGuild);
