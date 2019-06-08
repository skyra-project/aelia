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
	.add(5, ({ member, guild }) => Boolean(member && guild!.settings.get('dj') && member.roles.has(guild!.settings.get('dj') as string)), { fetch: true })
	.add(6, ({ member, guild }) => member!
		&& ((guild!.settings.get('administrator') && member!.roles.has(guild!.settings.get('administrator') as string))
			|| member!.permissions.has('MANAGE_GUILD')), { fetch: true });

const client = new AeliaClient(CLIENT_OPTIONS);
client.login(TOKEN)
	.catch(error => { client.console.error(error); });

if (!CLIENT_OPTIONS.dev) {
	client.ipc.connectTo('ny-api', 9997)
		.catch(error => { client.console.error(error); });
}
