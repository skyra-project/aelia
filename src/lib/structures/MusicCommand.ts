import { Command, CommandOptions, CommandStore, util } from 'klasa';
import { AeliaClient } from '../AeliaClient';

export class MusicCommand extends Command {

	/**
	 * Whether this command requires an active VoiceConnection or not
	 */
	public requireMusic: boolean;

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string, options: MusicCommandOptions = {}) {
		// By nature, music commands only run in VoiceChannels, which are in Guilds.
		util.mergeDefault({ runIn: ['text'], requireMusic: false }, options);

		super(client, store, file, directory, options);
		this.requireMusic = options.requireMusic;
	}

}

export const YOUTUBE_REGEXP = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed)?)?\/|watch\/?\?(?:\S*?&?v=))|youtu\.be\/)([\w-]{11})(?:[^\w-]|$)/;

export type MusicCommandOptions = CommandOptions & {
	requireMusic?: boolean;
};
