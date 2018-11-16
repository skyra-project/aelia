import { Snowflake, StreamDispatcher, VoiceConnection } from 'discord.js';
import { KlasaMessage, KlasaTextChannel, KlasaUser, KlasaVoiceChannel, util } from 'klasa';
import { LoadType, Player, Status, Track } from 'lavalink';
import { AeliaClient } from '../AeliaClient';
import { AeliaGuild } from '../extensions/AeliaGuild';
import { enumerable } from '../util/util';
import { Song } from './Song';

export class MusicManager {

	/**
	 * The Client that manages this instance
	 */
	@enumerable(false)
	public readonly client: AeliaClient;

	/**
	 * The AeliaGuild instance that manages this instance
	 */
	@enumerable(false)
	public readonly guild: AeliaGuild;

	/**
	 * The current queue for this manager
	 */
	public readonly queue: Song[] = [];

	/**
	 * The volume for this manager
	 */
	public volume = 100;

	/**
	 * Whether or not this should replay
	 */
	public replay = false;

	/**
	 * The Dj
	 */
	public dj: Snowflake | null = null;

	/**
	 * The Channel instance where music commands are played at
	 */
	@enumerable(false)
	public channel: KlasaTextChannel | null = null;

	/**
	 * The position of the current track
	 */
	@enumerable(false)
	private position = 0;

	/**
	 * The paused and resumed timestamps
	 */
	@enumerable(false)
	private readonly times = {
		paused: 0,
		resumed: 0
	};

	/**
	 * The event listeners
	 */
	@enumerable(false)
	private readonly _listeners: MusicManagerListeners = {
		disconnect: null,
		end: null,
		error: null
	};

	public constructor(guild: AeliaGuild) {
		this.client = guild.client;
		this.guild = guild;
	}

	/**
	 * The player
	 */
	public get player(): Player | null {
		return this.client.lavalink.players.get(this.guild.id);
	}

	/**
	 * The status
	 */
	public get status(): Status | null {
		return this.player.status;
	}

	/**
	 * Whether or not the manager is playing
	 */
	public get playing(): boolean {
		return this.status === Status.PLAYING;
	}

	/**
	 * Whether or not the manager is paused
	 */
	public get paused(): boolean {
		return this.status === Status.PAUSED;
	}

	/**
	 * Whether or not the manager is ended
	 */
	public get ended(): boolean {
		return this.status === Status.ENDED;
	}

	/**
	 * The playing time since the start or last resume
	 */
	public get playingTime(): number {
		return this.times.resumed ? Date.now() - this.times.resumed : 0;
	}

	/**
	 * The paused time since the last pause
	 */
	public get pausedTime(): number {
		return this.times.paused ? Date.now() - this.times.paused : 0;
	}

	/**
	 * The total played time
	 */
	public get trackPosition(): number {
		return this.position + this.playingTime;
	}

	/**
	 * The remaining time for the current track
	 */
	public get trackRemaining(): number {
		return this.queue.length ? this.queue[0].duration - this.trackPosition : -1;
	}

	/**
	 * The VoiceChannel Aelia is connected to
	 */
	public get voiceChannel(): KlasaVoiceChannel {
		return this.guild.me.voice.channel as KlasaVoiceChannel;
	}

	/**
	 * The VoiceChannel's connection
	 */
	public get connection(): VoiceConnection {
		const voiceChannel = this.voiceChannel;
		return (voiceChannel && voiceChannel.connection) || null;
	}

	/**
	 * The VoiceConnection's dispatcher
	 */
	public get dispatcher(): StreamDispatcher {
		const connection = this.connection;
		return (connection && connection.dispatcher) || null;
	}

	public get djUser(): KlasaUser | null {
		return (this.dj && this.client.users.get(this.dj) as KlasaUser) || null;
	}

	/**
	 * The voice channel's listeners
	 */
	public get listeners(): Snowflake[] {
		const voiceChannel = this.voiceChannel;
		return voiceChannel ? voiceChannel.members.map((member) => member.id) : [];
	}

	/**
	 * Add a song to the queue
	 * @param user The user that requests this song
	 * @param song The url to add
	 */
	public add(user: KlasaUser, song: Track | Track[]): this {
		if (Array.isArray(song)) this.queue.push(...song.map((info) => new Song(info, user)));
		else this.queue.push(new Song(song, user));
		return this;
	}

	/**
	 * Fetch something in Lavalink's REST API
	 * @param song The song to search
	 */
	public async fetch(song: string): Promise<Track[]> {
		const response = await this.client.lavalink.load(song);
		if (response.loadType === LoadType.NO_MATCHES) throw `I'm sorry but I wasn't able to find the track!`;
		if (response.loadType === LoadType.LOAD_FAILED) throw `I'm sorry but I couldn't load this song! Maybe try other song!`;
		return response.tracks;
	}

	/**
	 * Set the replay mode
	 * @param value The value to set
	 */
	public setReplay(value: boolean): this {
		this.replay = value;
		return this;
	}

	/**
	 * Set the DJ
	 * @param user The user to set
	 */
	public setDJ(user: Snowflake | null): this {
		this.dj = user;
		return this;
	}

	/**
	 * Set the volume for this player
	 * @param volume The new volume, range of (0..200]
	 */
	public async setVolume(volume: number): Promise<this> {
		if (volume <= 0) throw `Woah, you can just leave the voice channel if you want silence!`;
		if (volume > 200) throw `I'll be honest, an airplane's nacelle would be less noisy than this!`;
		await this.player.setVolume(volume);
		return this;
	}

	/**
	 * Seek to a position of a song
	 * @param position The new position in milliseconds to seek
	 */
	public async seek(position: number): Promise<this> {
		const player = this.player;
		if (player) await player.seek(position);
		return this;
	}

	/**
	 * Join a voice channel, handling ECONNRESETs
	 * @param voiceChannel Join a voice channel
	 */
	public async join(voiceChannel: KlasaVoiceChannel): Promise<this> {
		await this.player.join(voiceChannel.id, { deaf: true });
		return this;
	}

	/**
	 * Leave the voice channel, reseating all the current data
	 */
	public async leave(): Promise<this> {
		await this.player.leave();
		this.channel = null;
		this.reset();
		return this;
	}

	/**
	 * Play the queue
	 */
	public async play(resolve: Function, reject: Function): Promise<this> {
		if (!this.voiceChannel) throw 'Where am I supposed to play the music? I am not in a voice channel!';
		if (!this.queue.length) throw 'No songs left in the queue!';
		if (this.playing) throw `Decks' spinning, can't you hear it?`;

		// Setup the events
		if (this._listeners.end) this._listeners.end(true);
		this._listeners.end = (finish: boolean) => {
			this._listeners.end = null;
			this._listeners.disconnect = null;
			this._listeners.error = null;
			if (finish) resolve();
		};
		this._listeners.error = (error) => {
			this._listeners.end(false);
			reject(error);
		};
		this._listeners.disconnect = (code) => {
			this._listeners.end(false);
			if (code >= 4000) reject('I got disconnected forcefully!');
			else resolve();
		};
		this.times.paused = 0;
		this.times.resumed = Date.now();

		await this.player.play(this.queue[0].track);
		return this;
	}

	/**
	 * Pause the queue
	 */
	public async pause(): Promise<this> {
		if (!this.paused) {
			await this.player.pause(true);
			this.times.paused = Date.now();
			this.times.resumed = 0;
		}
		return this;
	}

	/**
	 * Resume the queue
	 */
	public async resume(): Promise<this> {
		if (!this.playing) {
			await this.player.pause(false);
			this.times.paused = 0;
			this.times.resumed = Date.now();
		}
		return this;
	}

	/**
	 * Skips the current song
	 */
	public async skip(): Promise<this> {
		this.reset();
		this.queue.shift();
		await this.player.stop();
		return this;
	}

	/**
	 * Remove the list
	 */
	public prune(): this {
		if (this.queue.length) this.queue.length = this.playing ? 1 : 0;
		return this;
	}

	/**
	 * Handle events at MusicManager level
	 * @param payload The payload from Lavalink
	 */
	public receiver(payload: LavalinkEvent): void {
		// If it's the end of the track, handle next song
		if (isTrackEndEvent(payload)) {
			if (this._listeners.end) this._listeners.end(true);
			if (!this.replay) this.queue.shift();
			this.reset();
			return;
		}

		// If there was an exception, handle it accordingly
		if (isTrackExceptionEvent(payload)) {
			this.client.emit('error', `[LL:${this.guild.id}] Error: ${payload.error}`);
			if (this._listeners.error) this._listeners.error(payload.error);
			if (this.channel) this.channel.send(`Something happened!\n${util.codeBlock('', payload.error)}`)
				.catch((error) => { this.client.emit('wtf', error); });
			return;
		}

		// If Lavalink gets stuck, alert the users of the downtime
		if (isTrackStuckEvent(payload)) {
			if (this.channel && payload.thresholdMs > 1000) {
				this.channel.send(`Hold on, I got a little problem, I'll be back in ${Math.ceil(payload.thresholdMs / 1000)} seconds!`)
					.then((message: KlasaMessage) => { message.delete({ timeout: payload.thresholdMs }); })
					.catch((error) => { this.client.emit('wtf', error); });
			}
			return;
		}

		// If the websocket closes badly (code >= 4000), there's most likely an error
		if (isWebSocketClosedEvent(payload)) {
			if (payload.code >= 4000) {
				this.client.emit('error', `[LL:${this.guild.id}] Disconnection with code ${payload.code}: ${payload.reason}`);
				this.channel.send(`Whoops, looks like I got a little problem with Discord!`)
					.then((message: KlasaMessage) => { message.delete({ timeout: 10000 }); })
					.catch((error) => { this.client.emit('wtf', error); });
			}
			if (this._listeners.disconnect) this._listeners.disconnect(payload.code);
			this.reset();
			return;
		}

		// If it's a player update, update the position
		if (isPlayerUpdate(payload)) {
			this.position = payload.state.position + Date.now() - payload.state.time;
			return;
		}

		// If it's a destroy payload, reset this instance
		if (isDestroy(payload)) {
			this.reset();
			return;
		}
	}

	private reset(): void {
		this.position = 0;
		this.volume = 100;
		this.times.paused = 0;
		this.times.resumed = 0;
	}

}

type MusicManagerListeners = {
	end(finish?: boolean): void;
	error(error: Error | string): void;
	disconnect(code: number): void;
};

type LavalinkEvent = {
	op: string;
	type?: string;
	guildId: string;
};

function isTrackEndEvent(x: LavalinkEvent): x is LavalinkEventTrackEndEvent {
	return x.type === 'TrackEndEvent';
}

function isTrackExceptionEvent(x: LavalinkEvent): x is LavalinkEventTrackExceptionEvent {
	return x.type === 'TrackExceptionEvent';
}

function isTrackStuckEvent(x: LavalinkEvent): x is LavalinkEventTrackStuckEvent {
	return x.type === 'TrackStuckEvent';
}

function isWebSocketClosedEvent(x: LavalinkEvent): x is LavalinkEventWebSocketClosedEvent {
	return x.type === 'WebSocketClosedEvent';
}

function isPlayerUpdate(x: LavalinkEvent): x is LavalinkEventPlayerUpdate {
	return x.op === 'playerUpdate';
}

function isDestroy(x: LavalinkEvent): x is LavalinkEventDestroy {
	return x.op === 'destroy';
}

type LavalinkEventTrackEndEvent = LavalinkEvent & {
	track: string;
	reason: string;
};

type LavalinkEventTrackExceptionEvent = LavalinkEvent & {
	track: string;
	error: string;
};

type LavalinkEventTrackStuckEvent = LavalinkEvent & {
	track: string;
	thresholdMs: number;
};

type LavalinkEventWebSocketClosedEvent = LavalinkEvent & {
	code: number;
	reason: string;
	byRemote: boolean;
};

type LavalinkEventPlayerUpdate = LavalinkEvent & {
	type: never;
	state: {
		time: number;
		position: number;
	};
};

type LavalinkEventDestroy = LavalinkEvent & {
	type: never;
};