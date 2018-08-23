const Song = require('./Song');

class MusicManager {

	constructor(guild) {
		/**
		 * The Client that manages this instance
		 * @since 1.0.0
		 * @type {Sneyra}
		 * @name MusicManager#client
		 */
		Object.defineProperty(this, 'client', { value: guild.client });

		/**
		 * The SneyraGuild instance that manages this instance
		 * @since 1.0.0
		 * @type {SneyraGuild}
		 * @name MusicManager#guild
		 */
		Object.defineProperty(this, 'guild', { value: guild });

		/**
		 * The current queue for this manager
		 * @since 1.0.0
		 * @type {Song[]}
		 */
		this.queue = [];

		/**
		 * The Channel instance where music commands are played at
		 * @since 1.0.0
		 * @type {TextChannel}
		 */
		this.channel = null;

		this.playing = false;

		this.paused = false;

		this.volume = 100;
	}

	get remaining() {
		if (!this.queue.length) return -1;
		const { player } = this;
		if (!player) return -1;
		return this.queue[0].duration - player.state.position;
	}

	/**
	 * The VoiceChannel Sneyra is connected to
	 * @since 1.0.0
	 * @type {?VoiceChannel}
	 * @readonly
	 */
	get voiceChannel() {
		return this.guild.me.voice.channel;
	}

	/**
	 * The VoiceChannel's connection
	 * @since 1.0.0
	 * @type {?VoiceConnection}
	 * @readonly
	 */
	get connection() {
		const { voiceChannel } = this;
		return (voiceChannel && voiceChannel.connection) || null;
	}

	/**
	 * The VoiceConnection's dispatcher
	 * @since 1.0.0
	 * @type {?StreamDispatcher}
	 * @readonly
	 */
	get dispatcher() {
		const { connection } = this;
		return (connection && connection.dispatcher) || null;
	}

	/**
	 * The player connected to this guild
	 * @since 3.0.0
	 * @type {Player}
	 * @readonly
	 */
	get player() {
		return this.client.lavalink.get(this.guild.id) || null;
	}

	/**
	 * Add a song to the queue
	 * @since 1.0.0
	 * @param {KlasaUser} user The user that requests this song
	 * @param {Object<string, *>} song The url to add
	 * @returns {this}
	 */
	add(user, song) {
		this.queue.push(new Song(song, user));
		return song;
	}

	/**
	 * Seek to a position of a song
	 * @since 3.0.0
	 * @param {number} position The new position in milliseconds to seek
	 * @returns {this}
	 */
	seek(position) {
		const { player } = this;
		if (player) player.seek(position);
		return this;
	}

	/**
	 * Join a voice channel, handling ECONNRESETs
	 * @since 1.0.0
	 * @param {VoiceChannel} voiceChannel Join a voice channel
	 * @returns {Promise<VoiceConnection>}
	 */
	join(voiceChannel) {
		return this.client.lavalink.join({
			guild: this.guild.id,
			channel: voiceChannel.id,
			host: 'localhost'
		}, { selfdeaf: true });
	}

	/**
	 * Leave the voice channel, reseating all the current data
	 * @since 1.0.0
	 * @returns {Promise<this>}
	 */
	async leave() {
		if (this.playing && this.player) this.player.stop();
		await this.client.lavalink.leave(this.guild.id);
		this.playing = false;
		return this;
	}

	async play() {
		if (!this.voiceChannel) throw 'Where am I supposed to play the music? I am not in a voice channel!';
		if (!this.queue.length) throw 'No songs left in the queue!';

		const { player } = this;
		if (!player) throw 'This dj table isn\'t connected!';

		const [song] = this.queue;
		player.play(song.track);
		this.playing = true;
		return player;
	}

	pause() {
		const { player } = this;
		if (!player) return null;
		player.pause();
		this.paused = true;
		return this;
	}

	resume() {
		const { player } = this;
		if (!player) return null;
		player.pause(false);
		this.paused = false;
		return this;
	}

	skip(force = false) {
		const { player } = this;
		if (player && force) player.stop();
		else this.queue.shift();
		return this;
	}

	prune() {
		this.queue.length = 0;
		return this;
	}

	async destroy() {
		this.queue = [];
		this.playing = false;
		this.textChannel = null;
		this.volume = 100;

		await this.leave();
	}

}

module.exports = MusicManager;
