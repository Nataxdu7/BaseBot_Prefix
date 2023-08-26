const { Client, GatewayIntentBits, Collection, ActivityType } = require("discord.js");
const { readdirSync } = require("fs");
const config = require('./config.json');
const client = new Client({ intents: 3276799 });

client.commands = new Collection();
client.events = new Collection();

const commandFolders = readdirSync('./commands');

for (const folder of commandFolders) {
    const commandFiles = readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    console.log(`${folder} commands loaded:`);

    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command); // Assurez-vous que votre module de commande exporte la propriété 'name'
        console.log(`> ${command.name} loaded!`);
    }
}

client.on('ready', () => {
    console.log(client.user.username);
    client.user.setActivity('Cupid - Support', { type: ActivityType.Streaming, url: "https://twitch.tv/nataxdu7" });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const usedPrefix = config.prefix;

    if (!message.content.startsWith(usedPrefix)) {
        return;
    }

    const args = message.content.slice(usedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) {
        return;
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send('Une erreur est survenue lors de l\'exécution de cette commande.');
    }
});

client.login(config.token);
