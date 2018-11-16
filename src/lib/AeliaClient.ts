import { Colors, KlasaClient, KlasaClientOptions, util } from 'klasa';
import { BaseNodeOptions, Node as Lavalink } from 'lavalink';
import { Node } from 'veza';
import { IPCMonitorStore } from './structures/IPCMonitorStore';

// Load custom structures
import './extensions/AeliaGuild';

const g = new Colors({ text: 'green' }).format('[IPC   ]');
const y = new Colors({ text: 'yellow' }).format('[IPC   ]');
const r = new Colors({ text: 'red' }).format('[IPC   ]');

export class AeliaClient extends KlasaClient {

	public options: Required<AeliaClientOptions>;
	public ipcMonitors = new IPCMonitorStore(this);
	public ipc = new Node('aelia-master')
		.on('client.identify', (client) => { this.console.log(`${g} Client Connected: ${client.name}`); })
		.on('client.disconnect', (client) => { this.console.log(`${y} Client Disconnected: ${client.name}`); })
		.on('client.destroy', (client) => { this.console.log(`${y} Client Destroyed: ${client.name}`); })
		.on('server.ready', (server) => { this.console.log(`${g} Client Ready: Named ${server.name}`); })
		.on('error', (error, client) => { this.console.error(`${r} Error from ${client.name}`, error); })
		.on('message', this.ipcMonitors.run.bind(this.ipcMonitors));
	public lavalink = new Lavalink({
		send: async(guildID: string, packet: any) => {
			const guild = this.guilds.get(guildID);
			if (guild) this.ws.shards[guild.shardID].send(packet);
			else throw new Error('attempted to send a packet on the wrong shard');
		},
		...this.options.lavalink
	});

	public constructor(options?: AeliaClientOptions) {
		super(util.mergeDefault({ dev: false }, options));

		this.registerStore(this.ipcMonitors);

		this.once('klasaReady', () => {
			if (this.options.dev) this.permissionLevels.add(0, (client, message) => message.author.id === client.options.ownerID, { break: true });
		});
		this.on('raw', (pk) => {
			if (pk.t === 'VOICE_STATE_UPDATE') this.lavalink.voiceStateUpdate(pk.d);
			if (pk.t === 'VOICE_SERVER_UPDATE') this.lavalink.voiceServerUpdate(pk.d);
		});
	}

}

/**
 * The client options for Aelia
 */
export type AeliaClientOptions = KlasaClientOptions & {
	dev?: boolean;
	lavalink?: BaseNodeOptions;
};
