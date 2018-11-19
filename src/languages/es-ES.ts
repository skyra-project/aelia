import { Language, util } from 'klasa';

/* tslint:disable object-literal-sort-keys */
export default class extends Language {

	public language = {
		/**
		 * KLASA 0.5.0
		 * https://github.com/dirigeants/klasa/blob/master/src/languages/en-US.js
		 * https://github.com/dirigeants/klasa-pieces/blob/master/languages/es-ES.js
		 */
		DEFAULT: (key) => `La clave '${key}' no ha sido traducido para 'es-ES' todavía.`,
		DEFAULT_LANGUAGE: 'Idioma predeterminado',
		PREFIX_REMINDER: (prefix) => `El prefijo configurado para este servidor es: ${Array.isArray(prefix) ? prefix.map((pre) => `\`${pre}\``).join(', ') : `\`${prefix}\``}`,
		SETTING_GATEWAY_VALUE_FOR_KEY_NOEXT: (data, key) => `El valor '${data}' para la clave '${key}' no existe.`,
		SETTING_GATEWAY_VALUE_FOR_KEY_ALREXT: (data, key) => `El valor '${data}' para la clave '${key}' ya existe.`,
		SETTING_GATEWAY_SPECIFY_VALUE: 'Debes especificar el valor para añadir o filtrar.',
		SETTING_GATEWAY_KEY_NOT_ARRAY: (key) => `La clave '${key}' no es un Array.`,
		SETTING_GATEWAY_KEY_NOEXT: (key) => `La clave '${key}' no existe en el esquema de datos.`,
		SETTING_GATEWAY_INVALID_TYPE: 'El parámetro \'type\' debe ser o \'add\' o \'remove\'.',
		RESOLVER_INVALID_CUSTOM: (name, type) => `${name} debe ser un nombre válido de ${type}`,
		RESOLVER_INVALID_PIECE: (name, piece) => `${name} debe ser un nombre válido de ${piece}.`,
		RESOLVER_INVALID_MESSAGE: (name) => `${name} debe ser una ID de mensaje válida.`,
		RESOLVER_INVALID_USER: (name) => `${name} debe ser una mención o una ID de usuario válida.`,
		RESOLVER_INVALID_MEMBER: (name) => `${name} debe ser una mención o una ID de usuario válida.`,
		RESOLVER_INVALID_CHANNEL: (name) => `${name} debe ser una mención o una ID de canal válida.`,
		RESOLVER_INVALID_EMOJI: (name) => `${name} debe ser un emoji válido.`,
		RESOLVER_INVALID_GUILD: (name) => `${name} debe ser una ID válida de servidor.`,
		RESOLVER_INVALID_ROLE: (name) => `${name} debe ser una mención o una ID de rol válida.`,
		RESOLVER_INVALID_LITERAL: (name) => `Su opción no coincide con la siguiente posibilidad: ${name}`,
		RESOLVER_INVALID_BOOL: (name) => `${name} debe ser 'true' o 'false'.`,
		RESOLVER_INVALID_INT: (name) => `${name} debe ser un número entero.`,
		RESOLVER_INVALID_FLOAT: (name) => `${name} debe ser un número.`,
		RESOLVER_INVALID_REGEX_MATCH: (name, pattern) => `${name} debe seguir el patrón de la expresión regular \`${pattern}\``,
		RESOLVER_INVALID_URL: (name) => `${name} debe ser un enlace URL válido.`,
		RESOLVER_INVALID_DATE: (name) => `${name} debe ser una fecha válida.`,
		RESOLVER_INVALID_DURATION: (name) => `${name} debe ser una duración válida.`,
		RESOLVER_INVALID_TIME: (name) => `${name} debe ser una fecha o duración válida.`,
		RESOLVER_STRING_SUFFIX: ' carácteres',
		RESOLVER_MINMAX_EXACTLY: (name, min, suffix) => `${name} debe ser exactamente ${min}${suffix}.`,
		RESOLVER_MINMAX_BOTH: (name, min, max, suffix) => `${name} debe estar entre ${min} y ${max}${suffix}.`,
		RESOLVER_MINMAX_MIN: (name, min, suffix) => `${name} debe ser mayor que ${min}${suffix}.`,
		RESOLVER_MINMAX_MAX: (name, max, suffix) => `${name} debe ser menor que ${max}${suffix}.`,
		REACTIONHANDLER_PROMPT: '¿A qué página te gustaría saltar?',
		COMMANDMESSAGE_MISSING: 'Faltan uno o más argumentos al final de la entrada.',
		COMMANDMESSAGE_MISSING_REQUIRED: (name) => `${name} es un argumento requerido.`,
		COMMANDMESSAGE_MISSING_OPTIONALS: (possibles) => `Falta una opción requerida: (${possibles})`,
		COMMANDMESSAGE_NOMATCH: (possibles) => `Su opción no coincide con ninguna de las posibilidades: (${possibles})`,
		MONITOR_COMMAND_HANDLER_REPROMPT: (tag, error, time) => `${tag} | **${error}** | Usted tiene **${time}** segundos para responder este mensage emergente con un argumento válido. Escribe **"ABORT"** para abortar el mensaje emergente.`, // eslint-disable-line max-len
		MONITOR_COMMAND_HANDLER_REPEATING_REPROMPT: (tag, name, time) => `${tag} | **${name}** es un argumento repetible | Usted tiene **${time}** segundos para responder este mensage emergente con un argumento válido. Escribe **"ABORT"** para abortar el mensaje emergente.`, // eslint-disable-line max-len
		MONITOR_COMMAND_HANDLER_ABORTED: 'Abortado.',
		INHIBITOR_COOLDOWN: (remaining) => `Acabas de usar este comando. Puedes usarlo de nuevo en ${remaining} segundos.`,
		INHIBITOR_DISABLED: 'Este comando está desactivado.',
		INHIBITOR_MISSING_BOT_PERMS: (missing) => `Permisos insuficientes, necesito: **${missing}**`,
		INHIBITOR_NSFW: 'Usted no debería usar comandos NSFW en este canal.',
		INHIBITOR_PERMISSIONS: 'Usted no tiene permiso para usar este comando.',
		INHIBITOR_REQUIRED_CONFIGS: (settings) => `El servidor no tiene las siguientes clave${settings.length > 1 ? 's' : ''}: **${settings.join(', ')}** y no puede ser ejecutado.`,
		INHIBITOR_RUNIN: (types) => `Este comando sólo está disponible en los canales de tipo: ${types}.`,
		INHIBITOR_RUNIN_NONE: (name) => `El comando ${name} no está configurado para ser ejecutado en cualquier canal.`,
		COMMAND_BLACKLIST_DESCRIPTION: 'Añade o remove usuarios y servidores a la lista negra.',
		COMMAND_BLACKLIST_SUCCESS: (usersAdded, usersRemoved, guildsAdded, guildsRemoved) => [
			usersAdded.length ? `**Usuarios añadidos**\n${util.codeBlock('', usersAdded.join(', '))}` : '',
			usersRemoved.length ? `**Usuarios eliminados**\n${util.codeBlock('', usersRemoved.join(', '))}` : '',
			guildsAdded.length ? `**Servidores añadidos**\n${util.codeBlock('', guildsAdded.join(', '))}` : '',
			guildsRemoved.length ? `**Servidores eliminados**\n${util.codeBlock('', guildsRemoved.join(', '))}` : ''
		].filter((val) => val !== '').join('\n'),
		COMMAND_EVAL_DESCRIPTION: 'Evalúa Javascript arbitrario. Reservado para el dueño del bot.',
		COMMAND_EVAL_EXTENDEDHELP: [
			'El comando eval ejecuta el código tal y como está escrito, cualquier error será capturado.',
			'También usa la herramienta "flags". Escribe --silent, --depth=number o --async para personalizar la salida.',
			'El flag --silent silencia la salida.',
			'El flag --depth acepta un número, por ejemplo, --depth=2, para personalizar la profundidad de util.inspect.',
			'El flag --async rodea el código en un AsyncFunction en el cual puedes usar await, sin embargo, si necesitas saber el valor de algo, necesitarás la palabra clave return.',
			'El flag --showHidden activará la opción showHidden de util.inspect.',
			'Si la salida es demasiado largo, la salida será enviado como archivo, o en la consola si el bot no tiene el permiso ATTACH_FILES.'
		].join('\n'),
		COMMAND_EVAL_ERROR: (time, output, type) => `**Error**:${output}\n**Tipo**:${type}\n${time}`,
		COMMAND_EVAL_OUTPUT: (time, output, type) => `**Salida**:${output}\n**Tipo**:${type}\n${time}`,
		COMMAND_EVAL_SENDFILE: (time, type) => `La salida era demasiado largo... enviado como archivo.\n**Tipo**:${type}\n${time}`,
		COMMAND_EVAL_SENDCONSOLE: (time, type) => `La salida era demasiado largo... enviado el resultado a la consola.\n**Tipo**:${type}\n${time}`,
		COMMAD_UNLOAD: (type, name) => `✅ Descargado la pieza tipo ${type}: ${name}`,
		COMMAND_UNLOAD_DESCRIPTION: 'Descarga una pieza de Klasa.',
		COMMAND_UNLOAD: (type, name) => `✅ Descargado la pieza tipo ${type}: ${name}`,
		COMMAND_TRANSFER_ERROR: '❌ El archivo ha sido transferido o nunca existió.',
		COMMAND_TRANSFER_SUCCESS: (type, name) => `✅ Transferido la pieza tipo ${type}: ${name} con éxito.`,
		COMMAND_TRANSFER_FAILED: (type, name) => `La transferencia de la pieza tipo ${type}: ${name} al Cliente ha fallado. Por favor, revisa su consola.`,
		COMMAND_RELOAD: (type, name) => `✅ Recargado la pieza tipo ${type}: ${name}`,
		COMMAND_RELOAD_ALL: (type) => `✅ Recargado todas las piezas tipo ${type}.`,
		COMMAND_RELOAD_DESCRIPTION: 'Recarga una pieza de Klasa, o todas las piezas de un una colección.',
		COMMAND_REBOOT: 'Reiniciando...',
		COMMAND_REBOOT_DESCRIPTION: 'Reinicia el bot.',
		COMMAND_PING: '¿Ping?',
		COMMAND_PING_DESCRIPTION: 'Ejecuta una prueba de conexión a Discord.',
		COMMAND_PINGPONG: (diff, ping) => `¡Pong! (El viaje duró: ${diff}ms. Latido: ${ping}ms.)`,
		COMMAND_INVITE_SELFBOT: '¿Por qué necesitarías un enlace de invitación para un selfbot?',
		COMMAND_INVITE_DESCRIPTION: 'Muestra el enlace de invitación para el bot.',
		COMMAND_INFO_DESCRIPTION: 'Provee información sobre el bot.',
		COMMAND_HELP_DESCRIPTION: 'Muestra el mensaje de ayuda para los comandos.',
		COMMAND_HELP_NO_EXTENDED: 'Descripción detallada no disponible.',
		COMMAND_HELP_DM: '📥 | La lista de comandos ha sido enviado a tus mensajes privados.',
		COMMAND_HELP_NODM: '❌ | Parece que tienes tus mensajes privados desactivados, no pude enviarte la lista de comandos.',
		COMMAND_HELP_USAGE: (usage) => `Uso :: ${usage}`,
		COMMAND_HELP_EXTENDED: 'Información Detallada ::',
		COMMAND_ENABLE: (type, name) => `+ Activado con éxito la pieza tipo ${type}: ${name}`,
		COMMAND_ENABLE_DESCRIPTION: 'Re-activa temporalmente alguna pieza. Su estado original será restaurado al reiniciar.',
		COMMAND_DISABLE: (type, name) => `+ Desactivado con éxito la pieza ${type}: ${name}`,
		COMMAND_DISABLE_DESCRIPTION: 'Re-desactiva temporalmente alguna pieza. Su estado original será restaurado al reiniciar.',
		COMMAND_DISABLE_WARN: 'Probablemente no quieras desactivar eso, ya que no podrías ejecutar un comando para reactivarlo.',
		COMMAND_CONF_NOKEY: 'Debes escribir una clave',
		COMMAND_CONF_NOVALUE: 'Debes escribir un valor',
		COMMAND_CONF_GUARDED: (name) => `La clave ${util.toTitleCase(name)} no debería ser desactivado.`,
		COMMAND_CONF_UPDATED: (key, response) => `Actualizado con éxito la clave **${key}**: \`${response}\``,
		COMMAND_CONF_KEY_NOT_ARRAY: 'Esta clave no almacena múltiples valores. Usa la acción \'reset\'.',
		COMMAND_CONF_GET_NOEXT: (key) => `La clave **${key}** no parece existir.`,
		COMMAND_CONF_GET: (key, value) => `El valor para la clave **${key}** es: \`${value}\``,
		COMMAND_CONF_RESET: (key, response) => `El valor para la clave **${key}** ha sido restaurada a: \`${response}\``,
		COMMAND_CONF_SERVER_DESCRIPTION: 'Define la configuración por servidor.',
		COMMAND_CONF_SERVER: (key, list) => `**Configuración del servidor${key}**\n${list}`,
		COMMAND_CONF_USER_DESCRIPTION: 'Define la configuración por usuario.',
		COMMAND_CONF_USER: (key, list) => `**Configuración del usuario${key}**\n${list}`,
		COMMAND_STATS: (memUsage, uptime, users, servers, channels, klasaVersion, discordVersion, processVersion, message) => [
			'= STATISTICS =',
			'',
			`• Uso Memoria  :: ${memUsage} MB`,
			`• T. Actividad :: ${uptime}`,
			`• Usuarios     :: ${users}`,
			`• Servidores   :: ${servers}`,
			`• Canales      :: ${channels}`,
			`• Klasa        :: v${klasaVersion}`,
			`• Discord.js   :: v${discordVersion}`,
			`• Node.js      :: ${processVersion}`,
			`• Shard        :: ${(message.guild ? message.guild.shardID : 0) + 1} / ${this.client.options.totalShardCount}`
		],
		COMMAND_STATS_DESCRIPTION: 'Provee algunos detalles sobre el bot y sus estadísticas.',
		MESSAGE_PROMPT_TIMEOUT: 'El tiempo ha expirado.',

		/**
		 * AELIA
		 */
		COMMAND_INVITE: () => [
			`Para añadirme a tu servidor: <${this.client.invite}>`,
			`No tengas miedo de quitar algunos permisos, te haré saber si intentas ejecutar un comando que no pueda usar.`
		].join('\n'),
		COMMAND_INFO: [
			`Aelia 4.0.0 es un bot de música diseñada para estar al lado de Skyra con un rendimiento enorme y un tiempo de funcionamiento continuo de las 24 horas a la semana.`,
			`Estoy construida sobre Klasa, un framework 'plug-and-play' sobre la librería Discord.js.`,
			``,
			`Aelia ofrece:`,
			`• Comandos editables`,
			`• ¡Soporte multilenguaje!`,
			`• ¡Herramientas de fiesta! 🎉`
		].join('\n'),

		COMMAND_ADD_DESCRIPTION: `Añade una canción a la cola.`,
		COMMAND_ADD_PLAYLIST: (amount) => amount === 1
			? `🎵 Añadida **una** canción a la cola 🎶`
			: `🎵 Añadidas **${amount}** canciones a la cola 🎶`,
		COMMAND_ADD_SONG: (title) => `🎵 Añadida la canción **${title}** a la cola 🎶`,
		COMMAND_CLEAR_DESCRIPTION: `Borra las canciones de la cola.`,
		COMMAND_CLEAR_DENIED: `¡No puedes ejecutar este comando mientras que hayan más de 4 usuarios! ¡Debes ser el Dj de esta fiesta!`,
		COMMAND_CLEAR_SUCCESS: (amount) => amount === 1
			? `🗑 Una canción fue borrada de la cola.`
			: `🗑 ${amount} canciones fueron borradas de la cola.`,
		COMMAND_JOIN_DESCRIPTION: `Unirse al canal de voz del autor del mensaje.`,
		COMMAND_JOIN_NO_MEMBER: `Lo siento, pero Discord no me ha mandado la información necesaria que necesito para saber en qué canal de voz estás conectado/a...`,
		COMMAND_JOIN_NO_VOICECHANNEL: `No estás conectado/a a un canal de voz.`,
		COMMAND_JOIN_SUCCESS: (channel) => `Me he conectado con éxito al canal de voz ${channel}`,
		COMMAND_JOIN_VOICE_DIFFERENT: `Lo siento, pero estoy reproduciendo música en otro canal de voz. ¡Intenta de nuevo más tarde o únete a ellos!`,
		COMMAND_JOIN_VOICE_FULL: `No puedo unirme a tu canal de voz, está lleno... ¡echa a alguien con las botas o haz espacio para mí!`,
		COMMAND_JOIN_VOICE_NO_CONNECT: `No tengo suficientes permisos para unirme a tu canal de voz, necesito el permiso para conectarme a canales de voz.`,
		COMMAND_JOIN_VOICE_NO_SPEAK: `Puedo conectarme... pero no hablar. Por favor dame permisos para hablar.`,
		COMMAND_JOIN_VOICE_SAME: `¡Sube el volumen! ¡Ya estoy reproduciendo música ahí!`,
		COMMAND_LEAVE_DESCRIPTION: `Desconecta del canal de voz.`,
		COMMAND_LEAVE_SUCCESS: (channel) => `Me he desconectado con éxito del canal de voz ${channel}`,
		COMMAND_PAUSE_DESCRIPTION: `Pausa la canción actual.`,
		COMMAND_PAUSE_SUCCESS: '⏸ Pausado.',
		COMMAND_PLAY_DESCRIPTION: `¡Empecemos la cola!`,
		COMMAND_PLAY_END: `⏹ Del 1 al 10, siendo 1 la peor puntuación y 10 la mejor, ¿cómo valorarías la sesión? ¡Ya ha terminado!`,
		COMMAND_PLAY_NEXT: (song) => `🎧 Reproduciendo: **${song.title}**, pedida por: **${song.requester}**`,
		COMMAND_PLAY_QUEUE_EMPTY: (prefix) => `La cola está vacía, ¡añade algunas canciones a la cola con el comando \`${prefix}add\`!`,
		COMMAND_PLAY_QUEUE_PAUSED: (song) => `¡Había una canción pausada! ¡Reproduciéndolo ahora! Ahora reproduciendo: ${song}!`,
		COMMAND_PLAY_QUEUE_PLAYING: `¡Ey! ¡El disco ya está girando!`,
		COMMAND_PLAYING_DESCRIPTION: `Obtén información de la canción actual.`,
		COMMAND_PLAYING_DURATION: (duration) => `**Duración**: ${duration}`,
		COMMAND_PLAYING_QUEUE_EMPTY: `¿Es conmigo? Porque no hay nada en reproducción...`,
		COMMAND_PLAYING_QUEUE_NOT_PLAYING: `Creo que estás escuchando ruido de fondo, no estoy reproduciendo nada.`,
		COMMAND_QUEUE_DESCRIPTION: `Revisa la lista de cola.`,
		COMMAND_QUEUE_EMPTY: (prefix) => `¡La cola está vacía! Pero puedes añadir algunas canciones usando el comando \`${prefix}add\`.`,
		COMMAND_QUEUE_LINE: (title, requester) => `*${title}*, pedida por: **${requester}**`,
		COMMAND_QUEUE_TRUNCATED: (amount) => `Mostrando 10 canciones de ${amount}`,
		COMMAND_REMOVE_DESCRIPTION: `Elimina una canción de la lista de cola.`,
		COMMAND_REMOVE_INDEX_INVALID: `Mira, no soy una experta en mates, pero esperaba un número igual o mayor que 1...`,
		COMMAND_REMOVE_INDEX_OUT: (amount) => `He intentado acceder a esa canción por tí, ¡pero sólo tengo ${amount} ${amount === 1 ? 'canción' : 'canciones'} en mi mesa!`,
		COMMAND_REMOVE_DENIED: [
			`Lo veo un poco rudo el borrar la canción de alguien de la lista... Habla con ellos para quitarla o`,
			`grita al DJ si hay uno en este servidor, si la canción arruina la fiesta, ¡entonces ellos probablemente lo consideren!`
		].join(' '),
		COMMAND_REMOVE_SUCCESS: (song) => `🗑 Borrada la canción **${song.title}**, pedida por **${song.requester}**, de la cola.`,
		COMMAND_RESUME_DESCRIPTION: `Reanuda la canción actual.`,
		COMMAND_RESUME_SUCCESS: `▶ Reanudado.`,
		COMMAND_SKIP_DESCRIPTION: `Salta la canción actual.`,
		COMMAND_SKIP_PERMISSIONS: `No puedes ejecutar este comando, debes ser un DJ o un Moderador.`,
		COMMAND_SKIP_VOTES_VOTED: `Ya has votado para saltar esta canción.`,
		COMMAND_SKIP_VOTES_TOTAL: (amount, needed) => `🔸 | Votos: ${amount} de ${needed}`,
		COMMAND_SKIP_SUCCESS: (title) => `⏭ Saltada la canción ${title}.`,
		COMMAND_TIME_DESCRIPTION: `Revisa cuánto tiempo falta para terminar la canción.`,
		COMMAND_TIME_QUEUE_EMPTY: `¿Es conmigo? La cola está vacía...`,
		COMMAND_TIME_STREAM: `La canción actual es un directo, no tiene tiempo restante.`,
		COMMAND_TIME_REMAINING: (time) => `🕰 Tiempo restante: ${time}`,
		COMMAND_VOLUME_DESCRIPTION: `Controla el volumen para la canción.`,
		COMMAND_VOLUME_SUCCESS: (volume) => `📢 Volumen: ${volume}%`,
		COMMAND_VOLUME_CHANGED: (emoji, volume) => `${emoji} Volumen: ${volume}%`,

		INHIBITOR_MUSIC_QUEUE_EMPTY: `¡La cola está sin discos! ¡Añade algunas canciones así podemos empezar una fiesta!`,
		INHIBITOR_MUSIC_QUEUE_EMPTY_PLAYING: `¡La cola está sin discos! ¡Añade algunas canciones para mantener el alma de la fiesta!`,
		INHIBITOR_MUSIC_NOT_PLAYING_PAUSED: `¡El disco ya está pausado! ¡Vuelve de vuelta cuando quieras encender la fiesta de nuevo!`,
		INHIBITOR_MUSIC_NOT_PLAYING_STOPPED: `¡La cola está vacía! ¡Estoy muy segura que no está reproduciendo nada!`,
		INHIBITOR_MUSIC_NOT_PAUSED_PLAYING: `¡El disco ya está girando y la fiesta está en marcha hasta que termine la noche!`,
		INHIBITOR_MUSIC_NOT_PAUSED_STOPPED: `¡La cola está vacía! ¡Lo tomaré como que la fiesta está tranquila!`,
		INHIBITOR_MUSIC_DJ_MEMBER: `¡Creo que esto es algo que sólo un moderador o un administrador de la fiesta pueden hacer!`,
		INHIBITOR_MUSIC_USER_VOICE_CHANNEL: `¡Ey! Necesito que te unas a un canal de voz antes para usar este comando!`,
		INHIBITOR_MUSIC_BOT_VOICE_CHANNEL: `Temo que necesito estar en un canal de voz antes de poder usar este comando, ¡por favor muéstreme el camino!`,
		INHIBITOR_MUSIC_BOTH_VOICE_CHANNEL: `¡Hey! Parece que no estamos en el mismo canal de voz, ¡por favor únete conmigo!`,

		MUSICMANAGER_FETCH_NO_MATCHES: `Lo siento, ¡pero no he sido capaz de encontrar la canción que querías`,
		MUSICMANAGER_FETCH_LOAD_FAILED: `Lo siento, ¡pero no he podido cargar esta canción! Por si acaso, ¡intenta con otra canción!`,
		MUSICMANAGER_SETVOLUME_SILENT: `Woah, ¡podrías simplemente salir del canal de voz si quieres silencio!`,
		MUSICMANAGER_SETVOLUME_LOUD: `Seré honesta, ¡las turbinas de un avión serían menos ruidosos que esto!`,
		MUSICMANAGER_PLAY_NO_VOICECHANNEL: `¿Dónde se suponía que tenía que reproducir la música? ¡No estoy conectada a ningún canal de voz!`,
		MUSICMANAGER_PLAY_NO_SONGS: `¡No hay más canciones en la cola!`,
		MUSICMANAGER_PLAY_PLAYING: `Los discos están girando, ¿no los escuchas?`,
		MUSICMANAGER_PLAY_DISCONNECTION: `¡Fuí desconectada a la fuerza por Discord!`,
		MUSICMANAGER_ERROR: (error) => `¡Algo pasó!\n${error}`,
		MUSICMANAGER_STUCK: (seconds) => `Espera un momento, he tenido un pequeño problema. ¡Estaré de vuelta en ${seconds === 1 ? 'un segundo' : `${seconds} segundos`}!`,
		MUSICMANAGER_CLOSE: `¡Oops, parece que he tenido un pequeño problemita con Discord!`
	};

	public async init(): Promise<void> {
		// noop
	}

}
