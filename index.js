console.log("STARTED")
const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const { error } = require('node:console');
const { setTimeout } = require('node:timers');
const grpty = require('./grpty.js')
console.log("IMPORTED"+" : " + grpty.koreaDateTime())
const client = new Client({ intents: 131071 }); //intents를 모두 켜기

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log(`Ready?!${client.user.tag} : ${grpty.koreaDateTime()}`);
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: '오류 발생!\n'+error, ephemeral: true });
	}
});

client.on('messageCreate', msg => {
    if (msg.content === "?ping") {
        msg.reply(`${client.ws.ping}ms`)
    }
});


client.login(token);
