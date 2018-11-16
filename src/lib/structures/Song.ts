import { Snowflake } from 'discord.js';
import { KlasaUser } from 'klasa';
import { Track } from 'lavalink';
import { enumerable, showSeconds } from '../util/util';

export class Song {

	@enumerable(false)
	public track: string;
	@enumerable(false)
	public requester: KlasaUser;
	public identifier: string;
	public seekable: boolean;
	public author: string;
	public duration: number;
	public stream: boolean;
	public position: number;
	public title: string;
	public url: string;
	public skips: Set<Snowflake> = new Set();

	/**
	 * @param data The retrieved data
	 * @param requester The user that requested this song
	 */
	public constructor(data: Track, requester: KlasaUser) {
		this.track = data.track;
		this.requester = requester;
		this.identifier = data.info.identifier;
		this.seekable = data.info.isSeekable;
		this.author = data.info.author;
		this.duration = data.info.length;
		this.stream = data.info.isStream;
		this.position = data.info.position;
		this.title = data.info.title;
		this.url = data.info.uri;
		this.skips = new Set();
	}

	public get friendlyDuration(): string {
		return showSeconds(this.duration);
	}

	public toString(): string {
		return `Song<${this.url}>`;
	}

}

module.exports = Song;
