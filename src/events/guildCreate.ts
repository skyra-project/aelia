import { Snowflake, TextChannel } from 'discord.js';
import { Colors, Event } from 'klasa';
import { AeliaGuild } from '../lib/extensions/AeliaGuild';

const NOTICE = new Colors({ text: 'lightyellow' }).format('[GUILD JOIN]');

export default class extends Event {

	public async run(guild: AeliaGuild) {
		if (!guild.available) return null;

		const leave = await this.shouldLeave(guild);
		if (leave) await guild.leave().catch(() => { /* noop */ });

		// Emit the log to the console
		this.log(guild, leave);
	}

	public log(guild: AeliaGuild, leave: boolean): void {
		this.client.emit('log', `${NOTICE} ${guild.id} → ${guild.name}`);

		const statusChannel = this.client.channels.get('444088744279146496') as TextChannel;
		if (statusChannel) {
			statusChannel.sendCode('http', [
				'AELIA 4.0.0\n',
				'EVENT       : GUILD JOIN',
				`GUILD       : ${guild.id}`,
				`            : ${guild.name}`,
				`COUNT       : ${guild.memberCount}`,
				`OWNER       : ${guild.ownerID}`,
				`            : ${guild.owner!.user.username}`,
				`WHITELISTED : ${leave ? 'YES' : 'NO'}`
			].join('\n')).catch(error => { this.client.emit('wtf', error); });
		}
	}

	public async shouldLeave(guild: AeliaGuild): Promise<boolean> {
		// If the owner is Aelia's owner, do nothing
		if (this.client.options.owners.includes(guild.ownerID)) return false;

		// Check whether the guild or the guild owner are whitelisted or blacklisted
		const { settings } = this.client;
		const guildBlacklist = settings!.get('guildBlacklist') as Snowflake[];
		const userBlacklist = settings!.get('userBlacklist') as Snowflake[];
		const guildWhitelist = settings!.get('guildWhitelist') as Snowflake[];
		const userWhitelist = settings!.get('userWhitelist') as Snowflake[];

		if (guildBlacklist.includes(guild.id)
			|| userBlacklist.includes(guild.ownerID)) return true;
		if (guildWhitelist.includes(guild.id)
			|| userWhitelist.includes(guild.ownerID)) return false;

		const member = await guild.members.fetch(guild.ownerID).catch(() => null);
		if (!member) return true;

		const userAlertedList = settings!.get('userAlertedList') as Snowflake[];

		if (!userAlertedList.includes(member.id)) {
			await settings!.update('userAlertedList', member.user);
			// Send notice to the owner
			await member.user.send([
				`Hello ${member.user.username}! I am glad you want me in your server, however, my services are not free.`,
				'\nTo get access to my music module, you need to donate for the **Aelia Access** tier in Patreon, check it out here: <https://www.patreon.com/kyranet>',
				'I am sorry you have to read this, but you can contact my owner in <https://skyradiscord.com/join> for a trial.',
				'\nOnce you pledge for the aforementioned tier, you will be added to my whitelist.'
			].join('\n')).catch(() => null);
		}

		return true;
	}

}
