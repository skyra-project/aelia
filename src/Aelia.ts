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
	.add(5, (message) => message.member && message.guild.settings.get('dj') && message.member.roles.has(message.guild.settings.get('dj')), { fetch: true })
	.add(6, (message) => message.member
		&& ((message.guild.settings.get('administrator') && message.member.roles.has(message.guild.settings.get('administrator')))
			|| message.member.permissions.has('MANAGE_GUILD')), { fetch: true });

const client = new AeliaClient(CLIENT_OPTIONS);
client.login(TOKEN).catch((error) => { client.console.error(error); });

if (!CLIENT_OPTIONS.dev) {
	client.ipc.connectTo('ny-api', 9997)
		.catch((error) => { client.console.error(error); });
}
