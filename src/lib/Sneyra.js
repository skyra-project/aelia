const { Client } = require('klasa');
const LavalinkPlayer = require('./structures/LavalinkManager');
const { lavalink } = require('../../config.js');

// Load custom structures
require('./extensions/SneyraGuild');

Client.defaultClientSchema
	.add('guildWhitelist', 'string', { array: true, min: 17, max: 19 })
	.add('userWhitelist', 'user', { array: true })
	.add('userBlacklist', 'user', { array: true })
	.add('userAlertedList', 'user', { array: true });

Client.defaultGuildSchema
	.add('administrator', 'Role')
	.add('dj', 'Role');

// Modify the permission levels
Client.defaultPermissionLevels
	.add(5, (client, msg) => msg.member && msg.guild.settings.dj && msg.member.roles.has(msg.guild.settings.dj), { fetch: true })
	.add(6, (client, msg) => msg.member
		&& ((msg.guild.settings.administrator && msg.member.roles.has(msg.guild.settings.administrator))
			|| msg.member.permissions.has('MANAGE_GUILD')), { fetch: true });

class Sneyra extends Client {

	constructor(options) {
		super(options);

		this.dev = options.dev;
		this.lavalink = null;

		if (!this.dev) this.once('ready', this.connectLavalink.bind(this));
	}

	connectLavalink() {
		this.lavalink = new LavalinkPlayer(this,
			[{ host: 'localhost', port: lavalink.PORT_WS, region: 'eu-central', password: lavalink.AUTHORIZATION }],
			{ user: this.user.id, shards: 1 }
		);
	}

}

module.exports = Sneyra;
