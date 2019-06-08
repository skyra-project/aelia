import { Structures } from 'discord.js';
import { KlasaGuild } from 'klasa';
import { MusicManager } from '../structures/MusicManager';

export class AeliaGuild extends KlasaGuild {

	/**
	 * The MusicManager instance for this client
	 */
	public music = new MusicManager(this);

}

Structures.extend('Guild', () => AeliaGuild);
