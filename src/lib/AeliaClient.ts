import { Colors, KlasaClient, KlasaClientOptions, util } from 'klasa';
import { Node as Lavalink } from 'lavalink';
import { Node } from 'veza';
import { IPCMonitorStore } from './structures/IPCMonitorStore';

// Load custom structures
import './extensions/AeliaGuild';

const g = new Colors({ text: 'green' }).format('[IPC   ]');
const y = new Colors({ text: 'yellow' }).format('[IPC   ]');
const r = new Colors({ text: 'red' }).format('[IPC   ]');

export class AeliaClient extends KlasaClient {

	public ipcMonitors = new IPCMonitorStore(this);
	public ipc = new Node('aelia-master')
		.on('client.identify', client => { this.console.log(`${g} Client Connected: ${client.name}`); })
		.on('client.disconnect', client => { this.console.log(`${y} Client Disconnected: ${client.name}`); })
		.on('client.destroy', client => { this.console.log(`${y} Client Destroyed: ${client.name}`); })
		.on('server.ready', server => { this.console.log(`${g} Client Ready: Named ${server.name}`); })
		.on('error', (error, client) => { this.console.error(`${r} Error from ${client.name}`, error); })
		.on('message', this.ipcMonitors.run.bind(this.ipcMonitors));

	public lavalink = new Lavalink({
		send: async (guildID: string, packet: any) => {
			const guild = this.guilds.get(guildID);
			if (guild) this.ws.shards.get(guild.shardID)!.send(packet);
			else throw new Error('attempted to send a packet on the wrong shard');
		},
		...this.options.lavalink
	});

	public constructor(options?: KlasaClientOptions) {
		super(util.mergeDefault({ dev: false }, options));

		this.registerStore(this.ipcMonitors);

		this.once('klasaReady', () => {
			if (this.options.dev) this.permissionLevels.add(0, ({ author }) => this.options.owners.includes(author!.id), { 'break': true });
		});
		this.on('raw', (pk: { t: string; d: any }) => {
			if (pk.t === 'VOICE_STATE_UPDATE') {
				this.lavalink.voiceStateUpdate(pk.d)
					.catch(error => { this.emit('error', error); });
			} else if (pk.t === 'VOICE_SERVER_UPDATE') {
				this.lavalink.voiceServerUpdate(pk.d)
					.catch(error => { this.emit('error', error); });
			}
		});
	}

}

AeliaClient.defaultClientSchema
	.add('guildBlacklist', 'String', { array: true })
	.add('guildWhitelist', 'String', { array: true })
	.add('userBlacklist', 'User', { array: true })
	.add('userWhitelist', 'User', { array: true })
	.add('userAlertedList', 'User', { array: true });

AeliaClient.defaultGuildSchema
	.add('administrator', 'Role')
	.add('dj', 'Role');
