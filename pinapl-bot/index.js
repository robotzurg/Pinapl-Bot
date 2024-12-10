/* eslint-disable no-unused-vars */
// I love you Pinapl Bot

const Discord = require('discord.js');
const fs = require('fs');
const { token, dev_token } = require('./config.json');
const db = require("./db.js");
const streams = require('./twitch_streams.js');

// Set up random number function
function randomNumber(min, max) {  
    return Math.random() * (max - min) + min; 
}  
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// create a new Discord client and give it some variables
const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, 
    GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages], partials: [Partials.Channel, Partials.Message, Partials.Reaction] });
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
const mainCommands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Place your client and guild ids here
const clientId = '791055052067962891';
const devClientId = '818709319084015616';
const guildId = '937424970907271270';
const devGuildId = '784994152189919264';

client.cooldowns = new Discord.Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    if (command.type === undefined) {
        // Slash Commands
        client.commands.set(command.data.name, command);
        mainCommands.push(command.data.toJSON());
    } else {
        // Context Menu Commands (these have a different structure)
        client.commands.set(command.name, command);
        mainCommands.push(command);
    }
}

let accum = 0;
let twitchChecked = false;

function streamCheck(a) {
	accum += a;

	const guild = client.guilds.cache.get(guildId); 
    if (!guild) {
        console.error(`Guild with ID ${guildId} not found.`);
        return;
    }
	
	if (accum >= 2) {
		setTimeout(() => {
			clearTimeout(1000);
			streams(client, guild);
			if (!twitchChecked) {
				console.log("Started twitch stream checking.");
				twitchChecked = true;
			}
			accum = 2;
		}, 1000);
	} else {
		setTimeout(() => {
			streamCheck(1);
		}, 5000);
	}
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: mainCommands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
	
})();

client.once('ready', async () => {
	streamCheck(accum);
    console.log('Ready!');
    const date = new Date().toLocaleTimeString().replace("/.*(d{2}:d{2}:d{2}).*/", "$1");
    console.log(date);
});

// Listen for interactions (INTERACTION COMMAND HANDLER)
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

    const command = await client.commands.get(interaction.commandName);
    
    if (command.admin === true) {
		if (interaction.user.id != "122568101995872256" && interaction.user.id != "145267507844874241") {
			return interaction.reply("This command isn't for you.");
		}
	}

	if (!client.cooldowns.has(interaction.commandName)) {
        client.cooldowns.set(interaction.commandName, new Discord.Collection());
    }
    
    const now = Date.now();
	client.timestamps = client.cooldowns.get(interaction.commandName);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (client.timestamps.has(interaction.user.id)) {
        const expirationTime = client.timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return interaction.reply(`please wait ${timeLeft.toFixed(0)} more second(s) before reusing the \`${interaction.commandName}\` command.`);
        }

    }

	client.timestamps.set(interaction.user.id, now);
	setTimeout(() => client.timestamps.delete(interaction.user.id), cooldownAmount); 

    try {
        await command.execute(interaction, client, cronTasks);
    } catch (error) {
        await console.error(error);
        await interaction.reply(`There was an error trying to execute that command!`);
    }
});

client.on('messageCreate', async message => {
	// Crosspost a message
	if (message.channel.type === Discord.ChannelType.GuildAnnouncement) {
		message.crosspost()
		.then(() => console.log('Crossposted message'))
		.catch(console.error);
	}
})

// login to Discord
client.login(token);

