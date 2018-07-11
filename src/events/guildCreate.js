const { Event, Colors } = require('klasa');

const NOTICE = new Colors({ text: 'lightyellow' }).format('[GUILD JOIN]');

module.exports = class extends Event {

	async run(guild) {
		// Emit the log to the console
		this.log(guild);

		// If the owner is Sneyra's owner, do nothing
		if (guild.ownerID === this.client.options.clientID) return null;

		// Check whether the guild or the guild owner are whitelisted or blacklisted
		const { configs } = this.client;
		if (configs.guildBlacklist.includes(guild.id)
			|| configs.userBlacklist.includes(guild.ownerID)) return guild.leave();
		if (configs.guildWhitelist.includes(guild.id)
			|| configs.userWhitelist.includes(guild.ownerID)) return null;

		const member = await guild.members.fetch(guild.ownerID).catch(() => null);
		if (!member) return guild.leave();

		if (configs.userAlertedList.includes(member.id)) {
			await configs.update('userAlertedList', member.user);
			// Send notice to the owner
			await member.user.send([
				`Hello ${member.user.username}! I am glad you want me in your server, however, my services are not free.`,
				'\nTo get access to my music module, you need to donate for the **Sneyra Access** tier in Patreon, check it out here: <https://www.patreon.com/kyranet>',
				'I am sorry you have to read this, but you can contact my owner in <https://skyradiscord.com/join> for a trial.',
				'\nOnce you pledge for the aforementioned tier, you will be added to my whitelist.'
			].join('\n')).catch(() => null);
		}

		return null;
	}

	log(guild) {
		this.client.emit('log', `${NOTICE} ${guild.id} → ${guild.name}`);

		const statusChannel = this.client.channels.get('444088744279146496');
		if (statusChannel) {
			statusChannel.send([
				'SNEYRA 3.0.0\n',
				'EVENT : GUILD JOIN',
				`GUILD : ${guild.id}`,
				`      : ${guild.name}`,
				`COUNT : ${guild.memberCount}`,
				`OWNER : ${guild.ownerID}`,
				`      : ${guild.owner.user.username}`
			].join('\n'), { code: 'http' });
		}
	}

};
