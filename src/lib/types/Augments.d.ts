import { IPCMonitorStore } from '../structures/IPCMonitorStore';
import { Node } from 'veza';
import { BaseNodeOptions, Node as Lavalink } from 'lavalink';

declare module 'discord.js' {

	interface Client {
		ipcMonitors: IPCMonitorStore;
		ipc: Node;
		lavalink: Lavalink;
	}

	interface ClientOptions {
		dev?: boolean;
		lavalink?: BaseNodeOptions;
	}

}

declare module 'klasa' {

	interface PieceDefaults {
		ipcMonitors?: PieceOptions;
	}

}
