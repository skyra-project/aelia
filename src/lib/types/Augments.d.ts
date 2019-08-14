import { IPCMonitorStore } from '../structures/IPCMonitorStore';
import { Client as VezaClient } from 'veza';
import { BaseNodeOptions, Node as Lavalink } from 'lavalink';
import { Queue } from '../structures/music/Queue';

declare module 'discord.js' {

	interface Client {
		readonly ipcMonitors: IPCMonitorStore;
		readonly ipc: VezaClient;
		readonly lavalink: Lavalink;
	}

	interface ClientOptions {
		dev?: boolean;
		lavalink?: BaseNodeOptions;
	}

	interface Guild {
		readonly music: Queue;
	}

}

declare module 'klasa' {

	interface PieceDefaults {
		ipcMonitors?: PieceOptions;
	}

}
