import { KlasaMessage } from 'klasa';
import { AeliaClient } from '../AeliaClient';
import { AeliaGuild } from '../extensions/AeliaGuild';

/**
 * The constructor type
 */
export type ConstructorType<V> = new (...args: any[]) => V;

/**
 * The AeliaMessage type
 */
export type AeliaMessage = KlasaMessage & {
	guild: AeliaGuild;
	client: AeliaClient;
};
