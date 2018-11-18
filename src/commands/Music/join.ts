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
			description: 'Joins the message author\'s voice channel.',
			music: ['USER_VOICE_CHANNEL']
		});
	}

	public async run(message: AeliaMessage): Promise<AeliaMessage> {
		if (!message.member) {
			await message.guild.members.fetch(message.author.id).catch(() => {
				throw 'I am sorry, but Discord did not tell me the information I need, so I do not know what voice channel are you connected to...';
			});
		}

		const { channel } = message.member.voice;
		if (!channel) throw 'You are not connected in a voice channel.';
		if (message.guild.music.playing) {
			const aeliaVoiceChannel = message.guild.music.voiceChannel;
			if (channel.id === aeliaVoiceChannel.id) throw 'Turn on your volume! I am playing music there!';
			throw 'I am sorry, but I am playing music in another channel, perhaps try later or ask nicely to the people who came first to join them!';
		}
		this.resolvePermissions(message, channel as KlasaVoiceChannel);

		await message.guild.music.join(channel as KlasaVoiceChannel);
		return message.sendMessage(`Successfully joined the voice channel ${channel}`) as Promise<AeliaMessage>;
	}

	public resolvePermissions(message: AeliaMessage, voiceChannel: KlasaVoiceChannel): void {
		if (voiceChannel.full) throw 'I cannot join your voice channel, it\'s full... kick somebody with the boot or make room for me!';

		const permissions = voiceChannel.permissionsFor(message.guild.me);
		if (!permissions.has(FLAGS.CONNECT)) throw 'I do not have enough permissions to connect to your voice channel. I am missing the CONNECT permission.';
		if (!permissions.has(FLAGS.SPEAK)) throw 'I can connect... but not speak. Please turn on this permission so I can emit music.';
	}

}
