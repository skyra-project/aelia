import { IPCMonitor } from '../lib/structures/IPCMonitor';

export default class extends IPCMonitor {

	public async run(): Promise<StatisticsResults> {
		const memoryUsage = process.memoryUsage();
		return {
			name: 'aelia',
			presence: null,
			statistics: this.client.ws.shards.map(shard => ({
				heapTotal: memoryUsage.heapTotal,
				heapUsed: memoryUsage.heapUsed,
				ping: shard.pings,
				status: shard.status
			}))
		};
	}

}

/**
 * The return from the broadcast
 */
export interface StatisticsResults {
	name: string;
	presence: PresenceType | null;
	statistics: ClientStatistics[];
}

/**
 * The client statistics for each shard
 */
export interface ClientStatistics {
	status: WebsocketStatus;
	heapUsed: number;
	heapTotal: number;
	ping: number[];
}

/**
 * The presence types
 */
export enum PresenceType {
	/**
	 * The Online status
	 */
	Online = 'online',
	/**
	 * The Offline status
	 */
	Offline = 'offline',
	/**
	 * The Idle status
	 */
	Idle = 'idle',
	/**
	 * The Do Not Disturb status
	 */
	DoNotDisturb = 'dnd'
}

/**
 * The websocket status
 */
export enum WebsocketStatus {
	/**
	 * The websocket is active
	 */
	Ready,
	/**
	 * The websocket is connecting
	 */
	Connecting,
	/**
	 * The websocket is reconnecting
	 */
	Reconnecting,
	/**
	 * The websocket is idle
	 */
	Idle,
	/**
	 * The websocket is nearly ready, fetching last data
	 */
	Nearly,
	/**
	 * The websocket is disconnected
	 */
	Disconnected
}
