import { inspect } from 'util';
import { CLIENT_OPTIONS, TOKEN } from '../config';
import { AeliaClient } from './lib/AeliaClient';
inspect.defaultOptions.depth = 1;

AeliaClient.defaultClientSchema
	.add('guildWhitelist', 'string', { array: true, min: 17, max: 19 })
	.add('userWhitelist', 'user', { array: true })
	.add('userBlacklist', 'user', { array: true })
	.add('userAlertedList', 'user', { array: true });

AeliaClient.defaultGuildSchema
	.add('administrator', 'Role')
	.add('dj', 'Role');

// Modify the permission levels
AeliaClient.defaultPermissionLevels
	.add(5, (_, msg) => msg.member && msg.guild.settings.get('dj') && msg.member.roles.has(msg.guild.settings.get('dj')), { fetch: true })
	.add(6, (_, msg) => msg.member
		&& ((msg.guild.settings.get('administrator') && msg.member.roles.has(msg.guild.settings.get('administrator')))
			|| msg.member.permissions.has('MANAGE_GUILD')), { fetch: true });

const client = new AeliaClient(CLIENT_OPTIONS);
client.login(TOKEN).catch((error) => { client.console.error(error); });

if (!CLIENT_OPTIONS.dev) {
	client.ipc.connectTo('ny-api', 9997)
		.catch((error) => { client.console.error(error); });
}
