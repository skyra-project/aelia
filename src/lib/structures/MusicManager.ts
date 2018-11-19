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
		if (response.loadType === LoadType.NO_MATCHES) throw this.guild.language.get('MUSICMANAGER_FETCH_NO_MATCHES');
		if (response.loadType === LoadType.LOAD_FAILED) throw this.guild.language.get('MUSICMANAGER_FETCH_LOAD_FAILED');
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
		if (volume <= 0) throw this.guild.language.get('MUSICMANAGER_SETVOLUME_SILENT');
		if (volume > 200) throw this.guild.language.get('MUSICMANAGER_SETVOLUME_LOUD');
		this.volume = volume;
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
		this.reset(true);
		return this;
	}

	/**
	 * Play the queue
	 */
	public play(): Promise<this> {
		if (!this.voiceChannel) return Promise.reject(this.guild.language.get('MUSICMANAGER_PLAY_NO_VOICECHANNEL'));
		if (!this.queue.length) return Promise.reject(this.guild.language.get('MUSICMANAGER_PLAY_NO_SONGS'));
		if (this.playing) return Promise.reject(this.guild.language.get('MUSICMANAGER_PLAY_PLAYING'));

		return new Promise((resolve, reject) => {
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
				if (code >= 4000) reject(this.guild.language.get('MUSICMANAGER_PLAY_DISCONNECTION'));
				else resolve();
			};
			this.times.paused = 0;
			this.times.resumed = Date.now();

			this.player.play(this.queue[0].track)
				.catch(reject);
		});
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
			if (this.channel) this.channel.sendLocale('MUSICMANAGER_ERROR', [util.codeBlock('', payload.error)])
				.catch((error) => { this.client.emit('wtf', error); });
			return;
		}

		// If Lavalink gets stuck, alert the users of the downtime
		if (isTrackStuckEvent(payload)) {
			if (this.channel && payload.thresholdMs > 1000) {
				this.channel.sendLocale('MUSICMANAGER_STUCK', [Math.ceil(payload.thresholdMs / 1000)])
					.then((message: KlasaMessage) => message.delete({ timeout: payload.thresholdMs }))
					.catch((error) => { this.client.emit('wtf', error); });
			}
			return;
		}

		// If the websocket closes badly (code >= 4000), there's most likely an error
		if (isWebSocketClosedEvent(payload)) {
			if (payload.code >= 4000) {
				this.client.emit('error', `[LL:${this.guild.id}] Disconnection with code ${payload.code}: ${payload.reason}`);
				this.channel.sendLocale('MUSICMANAGER_CLOSE')
					.then((message: KlasaMessage) => message.delete({ timeout: 10000 }))
					.catch((error) => { this.client.emit('wtf', error); });
			}
			if (this._listeners.disconnect) this._listeners.disconnect(payload.code);
			this.reset(true);
			return;
		}

		// If it's a player update, update the position
		if (isPlayerUpdate(payload)) {
			this.position = payload.state.position + Date.now() - payload.state.time;
			return;
		}

		// If it's a destroy payload, reset this instance
		if (isDestroy(payload)) {
			this.reset(true);
			return;
		}
	}

	private reset(volume: boolean = false): void {
		this.position = 0;
		this.times.paused = 0;
		this.times.resumed = 0;
		if (volume) this.volume = 100;
	}

}

/**
 * The manager event listeners
 */
type MusicManagerListeners = {
	end(finish?: boolean): void;
	error(error: Error | string): void;
	disconnect(code: number): void;
};

/**
 * The basic lavalink node
 */
type LavalinkEvent = {
	op: string;
	type?: string;
	guildId: string;
};

/**
 * Check if it's an end event
 * @param x The event to check
 */
function isTrackEndEvent(x: LavalinkEvent): x is LavalinkEvent & { track: string; reason: string } {
	return x.type === 'TrackEndEvent';
}

/**
 * Check if it's an exception event
 * @param x The event to check
 */
function isTrackExceptionEvent(x: LavalinkEvent): x is LavalinkEvent & { track: string; error: string } {
	return x.type === 'TrackExceptionEvent';
}

/**
 * Check if it's a stuck event
 * @param x The event to check
 */
function isTrackStuckEvent(x: LavalinkEvent): x is LavalinkEvent & { track: string; thresholdMs: number } {
	return x.type === 'TrackStuckEvent';
}

/**
 * Check if it's a ws closed event
 * @param x The event to check
 */
function isWebSocketClosedEvent(x: LavalinkEvent): x is LavalinkEvent & { code: number; reason: string; byRemote: boolean } {
	return x.type === 'WebSocketClosedEvent';
}

/**
 * Check if it's a player update event
 * @param x The event to check
 */
function isPlayerUpdate(x: LavalinkEvent): x is LavalinkEvent & { type: never; state: { time: number; position: number } } {
	return x.op === 'playerUpdate';
}

/**
 * Check if it's a destroy event
 * @param x The event to check
 */
function isDestroy(x: LavalinkEvent): x is LavalinkEvent & { type: never } {
	return x.op === 'destroy';
}
