/* eslint-disable no-unused-vars */
// I love you Pinapl Bot

const Discord = require('discord.js');
const fs = require('fs');
const { token, dev_token } = require('./config.json');
const db = require("../db.js");
const cron = require("node-cron");
const { add_role, remove_role, weighted_random, updateGameStatus, updateSponsorList, updateUserStatus, capitalize, dateToCron, test } = require('../func.js');
const { crateChance, trickyChance, treatChance, bloodbathEvents, miscEvents, attackEvents, injuryEvents, itemEvents, nightEvents, cornTypeChoices, dayTypeChoices, nightTypeChoices, final3TypeChoices, houseChance, botChance } = require('../arrays.json');

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
const cronTasks = [];
const mainCommands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Place your client and guild ids here
const clientId = '791055052067962891';
const devClientId = '818709319084015616';
const guildId = '771373425734320159';
const devGuildId = '784994152189919264';

let crateUsrID;
let intervalTime = randomNumber(2.88e+7, 4.32e+7);
client.cooldowns = new Discord.Collection();
//console.log(intervalTime);

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
    console.log('Ready!');
    const date = new Date().toLocaleTimeString().replace("/.*(d{2}:d{2}:d{2}).*/", "$1");
    console.log(date);

	// Reload scheduled messages
	let msgs = db.global_bot.get('msg_timestamps');
	for (let msgData of msgs) {
		let channelToSend = client.channels.cache.get(msgData.channel);
		if (msgData.timestamp == undefined) msgData.timestamp = '0';
		let task = cron.schedule(msgData.time, () => { 
			channelToSend.send(msgData.msg);
			let timestamps = db.global_bot.get('msg_timestamps');
			timestamps = timestamps.filter(v => v.time != msgData.time && v.msg != msgData.msg);
			db.global_bot.set('msg_timestamps', timestamps);
		}, {
			scheduled: true,
		});	
		cronTasks.push({timestamp: msgData.timestamp, task: task});
	}

	// Reload scheduled role changes
	let roles = db.global_bot.get('role_timestamps');
	for (let roleData of roles) {
		cron.schedule(roleData.time, () => { 
			try {
				const guild = client.guilds.cache.get('771373425734320159');
				let channelToSend = client.channels.cache.get('814788744573878312');

				if (roleData.remove == false) {
					add_role(guild, roleData.user, roleData.role)
					channelToSend.send(`The role **${roleData.role_name}** has been added to <@${roleData.user}> as per a scheduled role change.`);
				} else {
					remove_role(guild, roleData.user, roleData.role);
					channelToSend.send(`The role **${roleData.role_name}** has been removed from <@${roleData.user}> as per a scheduled role change.`);
				}

				let timestamps = db.global_bot.get('role_timestamps');
				timestamps = timestamps.filter(v => v.role != roleData.role || v.user != roleData.user || v.time != roleData.time);
				db.global_bot.set('role_timestamps', timestamps);
			} catch (err) {
				console.log(err);
			}
		}, {
			scheduled: true,
		});
	}

	console.log(`Reloaded ${msgs.length} scheduled messages.`);
	console.log(`Reloaded ${roles.length} scheduled role changes.`);
});
	
// const crateFunction = function() {
// 	const channel = client.channels.cache.get('889637708195070013');
// 	const cratePick = weighted_random(crateChance);

// 	switch(cratePick) {
// 		case 'pinapl': channel.send('<:botglad:916344650405642292> PINAPL CRATE <:botglad:916344650405642292>\n*React first to claim!*'); break;
// 		case 'tricky': channel.send('<:botcat:791088071802224710> TRICKY CRATE <:botcat:791088071802224710>\n*React first to claim!*'); break;
// 		case 'king': channel.send(':crown: KING CRATE :crown:\n*React first to claim!*'); break;
// 	}
	
// 	intervalTime = randomNumber(2.88e+7, 4.32e+7);
// 	setTimeout(crateFunction, intervalTime);
// };

// setTimeout(crateFunction, intervalTime);

// Send the workers a message at 10am PST
cron.schedule('00 11 * * *', () => { 

	let profileList = db.profile.keyArray();
	for (let user of profileList) {
		db.profile.set(user, 0, 'sponsor_count');
	}
	// const workchannel = client.channels.cache.get('809854279552598016');
	// workchannel.send('Rise and shine employees of Citrus Inc.! Another day has passed, and now you can all work.\nDon\'t forget, you can use `/work` to work!');
	// for (let i = 0; i < db.workList.get('workerList').length; i++) {
	// 	let arr = db.workList.keyArray();
	// 	if (arr[i] != 'workerList') {
	// 		if (db.workList.get(arr[i], 'worked') === false) {
	// 			db.workList.set(arr[i], 0, 'streak');
	// 		} else {
	// 			db.workList.set(arr[i], false, 'worked');
	// 		}
	// 	}
	// }

	// db.workList.set('workerList', []);
	
}, {
    scheduled: true,
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

//Listen for people joining
client.on('guildMemberAdd', (guildMember) => {
	db.balances.set(guildMember.id, 0);
	db.mmbalances.set(guildMember.id, 0);
	db.profile.set(guildMember.id, {
		"betting": {
			"games_lost": 0,
			"games_played": 0,
			"games_tied": 0,
			"games_won": 0,
			"pp_lost": 0,
			"pp_won": 0,
		},
		"casino": {
			"crates": 0,
			"games_played": 0,
			"items_bought": 0,
			"pp_lost": 0,
			"pp_won": 0,
		},
		"items": [],
		"murder": {
			"games_list": [],
			"games_played": 0,
			"games_won": 0,
			"kd_ratio": 0,
			"kill_streak": 0,
			"kills": 0,
		},
		"slots": {
			"adios": 0,
			"games_played": 0,
			"jackpot": 0,
			"negative": 0,
			"neutral": 0,
			"positive": 0,
			"pp_lost": 0,
			"pp_won": 0,
		},
		"treats": 0,
		"sponsor_count": 0,
	});
});

// Listen for messages
client.on('messageCreate', async message => {

	// Schedule Message Command
	if (message.content.includes('!schedule')) { 
		if (message.author.id == '122568101995872256' || message.author.id == '145267507844874241' || message.author.id == '216811126074114048') {
			let args = message.content.split('\n');
			let channelId = args[0].split(' ');
			let outputMsgs = [];
			(channelId.length == 1) ? channelId = '994714605362364587' : channelId = channelId[1];
			if (isNaN(parseInt(channelId))) return message.channel.send('Invalid channel ID, please try again.')
			let channelToSend = client.channels.cache.get(channelId);
			if (channelToSend == undefined) return message.channel.send(`A channel with the ID \`${channelId}\` doesn't exist in this server. Please try again.`)

			if (args.length == 1) return message.channel.send('No messages were specified to schedule, please try again.')
			for (let i = 1; i < args.length; i++) {
				let msgArgs = args[i].split(' ');
				let unixTimestamp = msgArgs[0];
				let scheduleMsg = msgArgs.slice(1).join(' ');
				let date = new Date(unixTimestamp * 1000);
				const currentDate = new Date();
				if (!Date.parse(date)) return message.channel.send(`${unixTimestamp} is not a valid date timestamp, please try again.`);
				if (date < currentDate) return message.channel.send(`${unixTimestamp} is in the past, and thus cannot be used to schedule. Please try again.`)
				let scheduleTime = dateToCron(date);
				outputMsgs.push(`**${scheduleMsg}** (on <t:${unixTimestamp}:f>)`)
	
				let task = cron.schedule(scheduleTime, () => { 
					channelToSend.send(scheduleMsg);
					let timestamps = db.global_bot.get('msg_timestamps');
					timestamps = timestamps.filter(v => v.time != scheduleTime && v.msg != scheduleMsg);
					db.global_bot.set('msg_timestamps', timestamps);
				}, {
					scheduled: true,
				});	

				db.global_bot.push('msg_timestamps', {channel: channelId, time: scheduleTime, msg: scheduleMsg, timestamp: unixTimestamp});
				cronTasks.push({timestamp: unixTimestamp, task: task});
			}
		
			message.channel.send(`## Message Schedule Summary\nOutput Channel: <#${channelId}>\n-----------------------------------------------------------\n${outputMsgs.join('\n')}`);
		}
	}

	// if (message.content.includes('React first to claim')) {
	// 	message.react('🔑');

	// 	const filter = (reaction, user) => {
	// 		crateUsrID = user.id;
	// 		return ['🔑'].includes(reaction.emoji.name) && (user.id != message.author.id);
	// 	};

	// 	await message.awaitReactions({ filter, max: 1 })
	// 		.then(collected => {
	// 			const reaction = collected.first();
		
	// 			if (reaction.emoji.name === '🔑') {
	// 				let crateAmt = 0;

	// 				if (message.content.includes('PINAPL CRATE')) {
	// 					crateAmt = Math.round(randomNumber(5, 30));
	// 					message.channel.send(`<@${crateUsrID}> has claimed the crate.\nYou find **${crateAmt}** <:pp:772971222119612416>! Congratulations!`);
	// 					db.balances.math(crateUsrID, '+', crateAmt);
	// 					db.profile.math(crateUsrID, '+', 1, 'casino.crates');

	// 				} else if (message.content.includes('TRICKY CRATE')) {
	// 					let chance = weighted_random(trickyChance);
	// 					console.log(crateUsrID);
	// 					if (chance === 'give') {
	// 						crateAmt = Math.round(randomNumber(20, 50));
	// 						message.channel.send(`<@${crateUsrID}> has claimed the crate.\nYou find **${crateAmt}** <:pp:772971222119612416>! Congratulations!`);
	// 						db.balances.math(crateUsrID, '+', crateAmt);
	// 						db.profile.math(crateUsrID, '+', 1, 'casino.crates');
	// 					} else if (chance === 'take') {
	// 						crateAmt = Math.round(randomNumber(1, 50));
	// 						message.channel.send(`<@${crateUsrID}> has claimed the crate.\n A hand comes out of the crate, reaches into your pocket, and steals **${crateAmt}** <:pp:772971222119612416>! Congratulations!`);
	// 						db.balances.math(crateUsrID, '-', crateAmt);
	// 						db.profile.math(crateUsrID, '+', 1, 'casino.crates');
	// 					}

	// 				} else if (message.content.includes('KING CRATE')) {
	// 					crateAmt = Math.round(randomNumber(50, 500));
	// 					message.channel.send(`<@${crateUsrID}> has claimed the crate.\nYou find **${crateAmt}** <:pp:772971222119612416>! Congratulations!`);
	// 					db.balances.math(crateUsrID, '+', crateAmt);
	// 					db.profile.math(crateUsrID, '+', 1, 'casino.crates');
	// 				}

	// 			}
	// 		});
	// }	
});

// login to Discord
client.login(token);

