# Aelia [![Discord](https://discordapp.com/api/guilds/254360814063058944/embed.png)](https://skyra.pw/join)

Aelia is a music bot (yeah, another bot in this world) built on top of [Klasa](https://github.com/dirigeants/klasa/),
and uses [Discord.js](https://github.com/discordjs/discord.js) to connect to the Discord API.

This is a much advanced version of [Sneyra], as it includes more commands and is written fully in TypeScript, as well as
a much better queue manager.

[Sneyra]: https://github.com/kyranet/Sneyra

## Development Requirements

- [`Node.js`]: To run the project.
- [`Lavalink`]: Audio server.
- [`Ny-API`]: (Dev Optional) Central server.

[`Node.js`]: https://nodejs.org/en/download/current/
[`Lavalink`]: https://github.com/Frederikam/Lavalink
[`Ny-API`]: https://github.com/kyranet/Ny-API

## Set-Up

Copy and paste the [`config.ts.example`] file and rename it to `config.ts`, then fill it with the precise variables.
Once all development requirements are set up:

```bash
# Lints and format all the code:
$ yarn lint

# Run Aelia in development mode, only requires
# Lavalink to be running:
$ yarn start

# Run Aelia in production mode, requires
# Lavalink and Ny-API to be running:
$ yarn pm2:start
```

> **Note**: Before pushing to the repository, please run `yarn lint` so formatting stays consistent and there are no
linter warnings.

[`config.ts.example`]: /config.ts.example

## Links

**Aelia links**

- [Support Server](https://skyra.pw/join)
- [Patreon](https://www.patreon.com/kyranet)

**Framework links**

- [Klasa's Website](https://klasa.js.org)
