import { Permissions } from 'discord.js';
import { CommandStore, KlasaVoiceChannel } from 'klasa';
import { AeliaClient } from '../../lib/AeliaClient';
import { MusicCommand } from '../../lib/structures/MusicCommand';
import { AeliaMessage } from '../../lib/types/Misc';
const { FLAGS } = Permissions;

export default class extends MusicCommand {

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			aliases: ['connect'],
			description: (language) => language.get('COMMAND_JOIN_DESCRIPTION'),
			music: ['USER_VOICE_CHANNEL']
		});
	}

	public async run(message: AeliaMessage): Promise<AeliaMessage> {
		if (!message.member) {
			await message.guild.members.fetch(message.author.id).catch(() => {
				throw message.language.get('COMMAND_JOIN_NO_MEMBER');
			});
		}

		const { channel } = message.member.voice;
		if (!channel) throw message.language.get('COMMAND_JOIN_NO_VOICECHANNEL');
		if (message.guild.music.playing) {
			const aeliaVoiceChannel = message.guild.music.voiceChannel;
			if (channel.id === aeliaVoiceChannel.id) throw message.language.get('COMMAND_JOIN_VOICE_SAME');
			throw message.language.get('COMMAND_JOIN_VOICE_DIFFERENT');
		}
		this.resolvePermissions(message, channel as KlasaVoiceChannel);

		await message.guild.music.join(channel as KlasaVoiceChannel);
		return message.sendLocale('COMMAND_JOIN_SUCCESS', [channel]) as Promise<AeliaMessage>;
	}

	public resolvePermissions(message: AeliaMessage, voiceChannel: KlasaVoiceChannel): void {
		if (voiceChannel.full) throw message.language.get('COMMAND_JOIN_VOICE_FULL');

		const permissions = voiceChannel.permissionsFor(message.guild.me);
		if (!permissions.has(FLAGS.CONNECT)) throw message.language.get('COMMAND_JOIN_VOICE_NO_CONNECT');
		if (!permissions.has(FLAGS.SPEAK)) throw message.language.get('COMMAND_JOIN_VOICE_NO_SPEAK');
	}

}
