const Sneyra = require('./lib/Sneyra');
const { tokens, version } = require('../config.js');

// eslint-disable-next-line no-process-env
const DEV = 'DEV' in process.env ? process.env.DEV === 'true' : !('PM2_HOME' in process.env);

const sneyra = new Sneyra({
	commandEditing: true,
	console: { useColor: true, utc: true },
	consoleEvents: { verbose: true },
	dev: DEV,
	disabledEvents: [
		'GUILD_BAN_ADD',
		'GUILD_BAN_REMOVE',
		'TYPING_START',
		'CHANNEL_PINS_UPDATE',
		'PRESENCE_UPDATE',
		'USER_UPDATE',
		'MESSAGE_REACTION_ADD',
		'MESSAGE_REACTION_REMOVE',
		'MESSAGE_REACTION_REMOVE_ALL'
	],
	pieceDefaults: { commands: { deletable: true, promptLimit: 5, quotedStringSupport: true } },
	prefix: 'm!',
	presence: { activity: { name: 'Sneyra, help', type: 'LISTENING' } },
	readyMessage: (client) =>
		`Sneyra ${version} ready! [${client.user.tag}] [ ${client.guilds.size} [G]] [ ${client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} [U]].`,
	regexPrefix: /^(hey )?sneyra(,|!)/i,
	restTimeOffset: 0,
	slowmode: 500,
	slowmodeAggressive: true
});

sneyra.login(DEV ? tokens.development : tokens.production)
	.catch((error) => sneyra.console.wtf(`Login Error:\n${(error && error.stack) || error}`));
