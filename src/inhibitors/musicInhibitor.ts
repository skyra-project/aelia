import { Inhibitor, InhibitorStore } from 'klasa';
import { AeliaClient } from '../lib/AeliaClient';
import { MusicBitField } from '../lib/structures/MusicBitField';
import { MusicCommand } from '../lib/structures/MusicCommand';
import { AeliaMessage } from '../lib/types/Misc';

const { FLAGS } = MusicBitField;

export default class extends Inhibitor {

	public constructor(client: AeliaClient, store: InhibitorStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			spamProtection: true
		});
	}

	public async run(message: AeliaMessage, command: MusicCommand): Promise<void> {
		if (!(command instanceof MusicCommand) || !command.music.bitfield) return;

		// MusicCommands only run in text channels
		if (message.channel.type !== 'text') return;

		// Checks for empty queue
		if (command.music.has(FLAGS.QUEUE_NOT_EMPTY) && !message.guild.music.queue.length) {
			throw message.guild.music.playing
				? `The table is out of discs! Please add some to keep the spirit of this party still up!`
				: `The table is out of discs! Please add some so we can start the party!`;
		}

		// Checks for playing
		if (command.music.has(FLAGS.VOICE_PLAYING) && !message.guild.music.playing) {
			throw message.guild.music.paused
				? `The deck is paused! Come back when you want to fire the party up again!`
				: `The deck is empty! I'm pretty sure it's not playing anything!`;
		}

		// Checks for paused
		if (command.music.has(FLAGS.VOICE_PAUSED) && !message.guild.music.paused) {
			throw message.guild.music.playing
				? `The deck is playing and the party is still up 'till the night ends!`
				: `The deck is empty! I'll take that as the party is chill!`;
		}

		if (command.music.has(FLAGS.DJ_MEMBER) && !await message.hasAtLeastPermissionLevel(5)) {
			throw `I believe this is something only a moderator or the manager of this party is supposed to do!`;
		}

		const sameVoiceChannel = command.music.has(FLAGS.SAME_VOICE_CHANNEL);
		if (sameVoiceChannel || command.music.has(FLAGS.USER_VOICE_CHANNEL)) {
			if (!message.member.voice.channelID) throw `Hey, I need you to join a voice channel before I can run this command!`;
		}
		if (sameVoiceChannel || command.music.has(FLAGS.AELIA_VOICE_CHANNEL)) {
			if (!message.guild.me.voice.channelID) throw `I am afraid I need to be in a voice channel to operate this command, please show me the way!`;
		}

		if (sameVoiceChannel && message.member.voice.channelID !== message.guild.me.voice.channelID) {
			throw `Hey! It looks like you're not in the same voice channel as me! Please come join me!`;
		}
	}

}
