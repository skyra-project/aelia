import { IPCMonitorStore } from '../structures/IPCMonitorStore';
import { Node } from 'veza';
import { BaseNodeOptions, Node as Lavalink } from 'lavalink';
import { Queue } from '../structures/music/Queue';

declare module 'discord.js' {

	interface Client {
		readonly ipcMonitors: IPCMonitorStore;
		readonly ipc: Node;
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
