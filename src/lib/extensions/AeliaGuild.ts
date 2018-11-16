import { Structures } from 'discord.js';
import { KlasaGuild } from 'klasa';
import { AeliaClient } from '../AeliaClient';
import { MusicManager } from '../structures/MusicManager';

export class AeliaGuild extends KlasaGuild {
	public client: AeliaClient;
	/**
	 * The MusicManager instance for this client
	 */
	public music = new MusicManager(this);
}

Structures.extend('Guild', () => AeliaGuild);
