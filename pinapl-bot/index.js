/* eslint-disable no-unused-vars */
// I love you Pinapl Bot

const Discord = require('discord.js');
const fs = require('fs');
const { token } = require('./config.json');
const db = require("./db.js");
const cron = require("node-cron");
const { add_role, remove_role, weighted_random, updateGameStatus, updateSponsorList, updateUserStatus, capitalize, dateToCron, test } = require('./func');
const { crateChance, trickyChance, treatChance, bloodbathEvents, miscEvents, attackEvents, injuryEvents, itemEvents, nightEvents, cornTypeChoices, dayTypeChoices, nightTypeChoices, final3TypeChoices, houseChance, botChance } = require('./arrays.json');

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
const guildId = '771373425734320159';

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

	// #region remove later
	// const list = client.guilds.cache.get("771373425734320159"); 
	// list.members.fetch().then(fetchedMembers => {
	// 	fetchedMembers.forEach(v => {
	// 		if (!db.balances.has(v.user.id)) {
	// 			db.balances.set(v.user.id, 0);
	// 		}

	// 		if (!db.mmbalances.has(v.user.id)) {
	// 			db.mmbalances.set(v.user.id, 0);
	// 		}

	// 		if (!db.profile.has(v.user.id)) {
	// 			db.profile.set(v.user.id, {
	// 				"betting": {
	// 					"games_lost": 0,
	// 					"games_played": 0,
	// 					"games_tied": 0,
	// 					"games_won": 0,
	// 					"pp_lost": 0,
	// 					"pp_won": 0,
	// 				},
	// 				"casino": {
	// 					"crates": 0,
	// 					"games_played": 0,
	// 					"items_bought": 0,
	// 					"pp_lost": 0,
	// 					"pp_won": 0,
	// 				},
	// 				"items": [],
	// 				"murder": {
	// 					"games_list": [],
	// 					"games_played": 0,
	// 					"games_won": 0,
	// 					"kd_ratio": 0,
	// 					"kill_streak": 0,
	// 					"kills": 0,
	// 				},
	// 				"slots": {
	// 					"adios": 0,
	// 					"games_played": 0,
	// 					"jackpot": 0,
	// 					"negative": 0,
	// 					"neutral": 0,
	// 					"positive": 0,
	// 					"pp_lost": 0,
	// 					"pp_won": 0,
	// 				},
	// 				"treats": 0,
	// 			});
	// 		}
	// 	});
	// });
	// #endregion

	// Reload scheduled messages
	let msgs = db.global_bot.get('msg_timestamps');
	for (let msgData of msgs) {
		let channelToSend = client.channels.cache.get(msgData.channel);
		cron.schedule(msgData.time, () => { 
			channelToSend.send(msgData.msg);
			let timestamps = db.global_bot.get('msg_timestamps');
			timestamps = timestamps.filter(v => v.time != msgData.time && v.msg != msgData.msg);
			db.global_bot.set('msg_timestamps', timestamps);
		}, {
			scheduled: true,
		});	
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
	
const crateFunction = function() {
	const channel = client.channels.cache.get('889637708195070013');
	const cratePick = weighted_random(crateChance);

	switch(cratePick) {
		case 'pinapl': channel.send('<:botglad:916344650405642292> PINAPL CRATE <:botglad:916344650405642292>\n*React first to claim!*'); break;
		case 'tricky': channel.send('<:botcat:791088071802224710> TRICKY CRATE <:botcat:791088071802224710>\n*React first to claim!*'); break;
		case 'king': channel.send(':crown: KING CRATE :crown:\n*React first to claim!*'); break;
	}
	
	intervalTime = randomNumber(2.88e+7, 4.32e+7);
	setTimeout(crateFunction, intervalTime);
};

// setTimeout(crateFunction, intervalTime);

// Send the workers a message at 10am PST
cron.schedule('00 11 * * *', () => { 
	const workchannel = client.channels.cache.get('809854279552598016');
	workchannel.send('Rise and shine employees of Citrus Inc.! Another day has passed, and now you can all work.\nDon\'t forget, you can use `/work` to work!');
	for (let i = 0; i < db.workList.get('workerList').length; i++) {
		let arr = db.workList.keyArray();
		if (arr[i] != 'workerList') {
			if (db.workList.get(arr[i], 'worked') === false) {
				db.workList.set(arr[i], 0, 'streak');
			} else {
				db.workList.set(arr[i], false, 'worked');
			}
		}
	}

	db.workList.set('workerList', []);
	
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
        await command.execute(interaction, client);
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
	});
});

// Listen for messages
client.on('messageCreate', async message => {
	//#region Bot Games
	// // This bottom block of code is the entire hunger games sim code. Be careful when messing with it.
	// if (message.content.includes('The games will now begin!') && (message.author.id === '818709319084015616' || message.author.id === '122568101995872256')) {
	// 	let gameIntervalTime = 100;
	// 	let t_choice = cornTypeChoices;
	// 	let tributeArray = db.tributes.keyArray();
	// 	let aliveArray = db.tributes.get('Alive');
	// 	console.log('Initializing...');
	// 	// db.stats.set('Game Status', 'Cornucopia');
	// 	let corn_check = false;
	// 	let message_to_send = /*`(override) ${db.tributes.keyArray().length - 2} tributes look around at one another, and then at the Cornucopia.\nEach contestant has the strength to win... Will they succeed?\n
	// 	:sunny: Dawn of Day 1: **The Cornucopia!** 🌽`;*/ 'fix';
	// 	let airdrop_array = [];
	// 	let airdrop_items = [];
	// 	let corn_items = [];
	// 	let corn_start_time = Date.now();

	// 	const eventPicker = function() {

	// 		if (db.tributes.get('Alive').length != 1) {

	// 			tributeArray = db.tributes.keyArray();
	// 			tributeArray = tributeArray.filter(key => key != 'Dead');
	// 			tributeArray = tributeArray.filter(key => key != 'Alive');
	// 			tributeArray = tributeArray.filter(key => db.tributes.get(key, 'status') === 'Alive');
	// 			aliveArray = db.tributes.get('Alive');
	// 			let time = new Date().toISOString().split('T')[1].slice(0, -8);
	// 			let typeArray = false;
	// 			let tribute = [false, false]; //Tributes 1 and 2
	// 			let gameStatus = db.stats.get('Game Status');
	// 			let dayNum = db.stats.get('Day');
	// 			let pickedEvent;
	// 			let tribPostedName = [];

	// 			if (gameStatus === 'Day') {
	// 				gameIntervalTime = 1800000;
	// 			}

	// 			switch (gameStatus) {
	// 				case "Cornucopia": t_choice = cornTypeChoices; break;
	// 				case "Day": t_choice = dayTypeChoices; break;
	// 				case "Night": t_choice = nightTypeChoices; break;
	// 				case "Transition To Day": t_choice = dayTypeChoices; break;
	// 				case "Transition To Night": t_choice = dayTypeChoices; break;
	// 			}

	// 			if (aliveArray.length <= 3) {
	// 				t_choice = final3TypeChoices;
	// 			}

	// 			airdrop_array = [];
	// 			corn_items = db.airdrop.keyArray();
	// 			airdrop_items = db.priority_airdrop.keyArray();

	// 			if (!message_to_send.includes('Each contestant has the strength')) {
	// 				message_to_send = 'Awaiting Event';
	// 			}

	// 			// Airdrops!
	// 			if (gameStatus === 'Transition To Day' && tributeArray.length > 6) { //Airdrop time
	// 				for (let i = 0; i < tributeArray.length; i++) {
	// 					let rand_drop;
	// 					if (airdrop_items.length != 0) {
	// 						rand_drop = airdrop_items[Math.floor(Math.random() * airdrop_items.length)];
	// 						airdrop_items = airdrop_items.filter(key => key != rand_drop);
	// 						db.priority_airdrop.delete(rand_drop);
	// 					} else {
	// 						rand_drop = corn_items[Math.floor(Math.random() * airdrop_items.length)];
	// 						corn_items = corn_items.filter(key => key != rand_drop);
	// 						db.airdrop.delete(rand_drop);
	// 					}

	// 					airdrop_array.push(`<@${tributeArray[i]}> receives a ${rand_drop}`);
	// 				}

	// 				message_to_send = `(override) :sunny: Dawn of **Day ${dayNum}** :sunny:\n*${aliveArray.length} tributes remain.*\nThe daily airdrops begin to fall from the sky...\n\n:package: **Daily Airdrops** :package:
	// 				\n${airdrop_array.join('\n')}`;

	// 				gameStatus = 'Day';
	// 				db.stats.set('Time', 'Day');
	// 				db.stats.set('Game Status', 'Day');
	// 				gameIntervalTime = 1800000;
	// 				let tempTribArray = db.tributes.keyArray();
	// 				tempTribArray = tempTribArray.filter(key => key != 'Alive');
	// 				tempTribArray = tempTribArray.filter(key => key != 'Dead');
	// 				for (let i = 0; i < tempTribArray.length; i++) {
	// 					console.log(tempTribArray[i]);
	// 					db.tributes.set(tempTribArray[i], false, 'action');
	// 				}

	// 				db.priority_airdrop.clear();
	// 				for (let i = 0; i < db.backpack.keyArray().length; i++) {
	// 					db.backpack.set(db.backpack.keyArray()[i], false, 'sponsored_item');
	// 				}

	// 			} else if (gameStatus === 'Transition To Day') { // If the last 6 people are left, no airdrops.

	// 				message_to_send = `(override) :sunny: Dawn of **Day ${dayNum}** :sunny:\n*${aliveArray.length} tributes remain.*`;

	// 				gameStatus = 'Day';
	// 				db.stats.set('Time', 'Day');
	// 				db.stats.set('Game Status', 'Day');
	// 				gameIntervalTime = 1800000;
	// 				let tempTribArray = db.tributes.keyArray();
	// 				tempTribArray = tempTribArray.filter(key => key != 'Alive');
	// 				tempTribArray = tempTribArray.filter(key => key != 'Dead');
	// 				for (let i = 0; i < tempTribArray.length; i++) {
	// 					console.log(tempTribArray[i]);
	// 					db.tributes.set(tempTribArray[i], false, 'action');
	// 				}

	// 			} else if (gameStatus === 'Transition To Night') { // Night transition
	// 				message_to_send = `(override) :crescent_moon: Night of **Day ${dayNum}**. :stars:`;
	// 				gameStatus = 'Night';
	// 				db.stats.set('Game Status', 'Night');
	// 				db.stats.set('Time', 'Night');
	// 			}

	// 			if (gameStatus === "Cornucopia") corn_check = false;

	// 			let tribInv;
	// 			let airdropInv;
	// 			let item = false;

	// 			let action = false;
	// 			let actTribNum;
	// 			let killNum;
	// 			let dmgNum;
	// 			let tribHealth;
	// 			let type;

	// 			if (gameStatus === 'Cornucopia') {
	// 				for (let i = 0; i < tributeArray.length; i++) {
	// 					if (db.tributes.get(tributeArray[i], 'in_corn') === true) {
	// 						corn_check = true;
	// 					}
	// 				}

	// 				if (corn_check === false) {
	// 					console.log('Done with Cornucopia');
	// 					gameStatus = 'Day';
	// 					db.stats.set('Game Status', 'Day');
	// 					db.stats.set('Time', 'Day');
	// 					message_to_send = '(override) The Cornucopia lays abandoned, and the remaining tributes flee to their own destinations...\n:sunny: Day 1: **The Games Begin!** :crossed_swords:';
	// 					gameIntervalTime = 3.6e+6 - (Date.now() - corn_start_time);

	// 					let tempTribArray = db.tributes.keyArray();
	// 					tempTribArray = tempTribArray.filter(key => key != 'Alive');
	// 					tempTribArray = tempTribArray.filter(key => key != 'Dead');
	// 					for (let i = 0; i < tempTribArray.length; i++) {
	// 						db.tributes.set(tempTribArray[i], false, 'action');
	// 					}
	// 				}
	// 			}

	// 			// Filter out tributes
	// 			if (gameStatus === 'Cornucopia') {
	// 				tributeArray = tributeArray.filter(key => db.tributes.get(key, 'in_corn') === true);
	// 			} else if (gameStatus === 'Day' || gameStatus === 'Night') {
	// 				tributeArray = tributeArray.filter(key => db.tributes.get(key, 'action') === false);
	// 				if (tributeArray.length === 0) {
	// 					for (let i = 0; i < tributeArray.length; i++) {
	// 						db.tributes.set(tributeArray[i], false, 'action');
	// 					}
	// 					tributeArray = db.tributes.keyArray();
	// 					tributeArray = tributeArray.filter(key => key != 'Dead');
	// 					tributeArray = tributeArray.filter(key => key != 'Alive');
	// 					tributeArray = tributeArray.filter(key => db.tributes.get(key, 'status') === 'Alive');
	// 				}
	// 			}

	// 			//Day/Night Switch
	// 			if (gameStatus === 'Day' && time === '21:00') {
	// 				message_to_send = `(override) As the eventful day starts to set, our tributes begin to wind down for the night.\nIn the distance, ${db.stats.get('Deaths Num')} cannonshots are heard.\n\n${db.stats.get('Deaths Users').join('\n')}\n\nThese tributes have fallen. React :regional_indicator_f: to pay respects.`;
	// 				db.stats.set('Game Status', 'Transition To Night');
	// 				db.stats.set('Time', 'Night');
	// 				db.stats.set('Deaths Num', 0);
	// 				db.stats.set('Deaths Users', []);

	// 				let tempTribArray = db.tributes.keyArray();
	// 				tempTribArray = tempTribArray.filter(key => key != 'Alive');
	// 				tempTribArray = tempTribArray.filter(key => key != 'Dead');
	// 				for (let i = 0; i < tempTribArray.length; i++) {
	// 					console.log(tempTribArray[i]);
	// 					db.tributes.set(tempTribArray[i], false, 'action');
	// 				}

	// 				gameStatus === 'Transition To Night';
	// 			} else if (gameStatus === 'Night' && time === '03:00') {
	// 				message_to_send = `(override) The arena grows quieter as the tributes drift off to sleep. :zzz: \nEnd of **Day ${dayNum}**`;
	// 				db.stats.set('Game Status', 'Transition To Day');
	// 				db.stats.set('Time', 'Day');
	// 				db.stats.math('Day', '+', 1);

	// 				let tempTribArray = db.tributes.keyArray();
	// 				tempTribArray = tempTribArray.filter(key => key != 'Alive');
	// 				tempTribArray = tempTribArray.filter(key => key != 'Dead');
	// 				for (let i = 0; i < tempTribArray.length; i++) {
	// 					console.log(tempTribArray[i]);
	// 					db.tributes.set(tempTribArray[i], false, 'action');
	// 				}

	// 				gameIntervalTime = 3.78e+7; // Takes us to 10.5 hours ahead, landing us at

	// 				gameStatus === 'Transition To Day';
	// 			}

	// 			if (!message_to_send.includes('(override)')) {
				
	// 				// Pick Tribute
	// 				tribPostedName = [];
	// 				tribute[0] = tributeArray[Math.floor(Math.random() * tributeArray.length)];
	// 				console.log(`Tribute: ${message.guild.members.cache.get(tribute[0]).displayName}`);
	// 				console.log(`Status: ${gameStatus}`);
	// 				tribInv = db.tributes.get(tribute[0], 'inventory');

	// 				if (db.backpack.get(tribute[0], 'no_ping') === true) {
	// 					tribPostedName.push(`**${message.guild.members.cache.get(tribute[0]).displayName}**`);
	// 				} else {
	// 					tribPostedName.push(`<@${tribute[0]}>`);
	// 				}
					
	// 				if (tribInv.length === 0) t_choice = t_choice.filter(key => key.item != 'item');

	// 				if (message_to_send.includes('(override)')) {
	// 					type = false;
	// 				} else {
	// 					type = weighted_random(t_choice);
	// 				}
	// 			}

	// 			// Figure out which array type we are using
	// 			switch (type) {
	// 				case 'bb': typeArray = bloodbathEvents; break;
	// 				case 'misc': typeArray = miscEvents; break;
	// 				case 'attack': typeArray = attackEvents; break;
	// 				case 'injury': typeArray = injuryEvents; break;
	// 				case 'item': typeArray = itemEvents; break;
	// 				case 'night': typeArray = nightEvents; break;
	// 				default: typeArray = false;
	// 			}
	// 			if (!typeArray === false) {

	// 				pickedEvent = typeArray[Math.floor(Math.random() * typeArray.length)];
	// 				// Pick an event
	// 				// Replace tribute 1 with the tribute we have
	// 				pickedEvent = pickedEvent.replace('(Tribute 1)', tribPostedName[0]);

	// 				// If there is a second tribute
	// 				if (pickedEvent.includes('(Tribute 2)')) {
	// 					while (tribute[0] === tribute[1] || tribute[1] === false) {
	// 						let tempTribArray = db.tributes.keyArray();
	// 						tempTribArray = tempTribArray.filter(key => key != 'Dead');
	// 						tempTribArray = tempTribArray.filter(key => key != 'Alive');
	// 						tempTribArray = tempTribArray.filter(key => db.tributes.get(key, 'status') === 'Alive');
	// 						tribute[1] = tempTribArray[Math.floor(Math.random() * tempTribArray.length)];
	// 					}

	// 					if (db.backpack.get(tribute[1], 'no_ping') === true) {
	// 						tribPostedName.push(`**${message.guild.members.cache.get(tribute[0]).displayName}**`);
	// 					} else {
	// 						tribPostedName.push(`<@${tribute[1]}>`);
	// 					}

	// 					pickedEvent = pickedEvent.replace('(Tribute 2)', tribPostedName[1]);
	// 					console.log(`Tribute: ${message.guild.members.cache.get(tribute[1]).displayName}`);
	// 				}

	// 				// Handle Items
	// 				if (pickedEvent.includes('{Item-G}')) { // Gaining an item

	// 					airdropInv = db.airdrop.keyArray();
	// 					item = airdropInv[Math.floor(Math.random() * airdropInv.length)];
	// 					db.airdrop.delete(item);
	// 					db.tributes.push(tribute[0], item, 'inventory');
	// 					pickedEvent = pickedEvent.replace('{Item-G}', `${item}`);

	// 				} else if (pickedEvent.includes('{Item-L}')) { // Loss of an item

	// 					tribInv = db.tributes.get(tribute[0], 'inventory');
	// 					item = tribInv[Math.floor(Math.random() * tribInv.length)];
	// 					tribInv = tribInv.filter(key => key != item);
	// 					db.tributes.set(tribute[0], tribInv, 'inventory');
	// 					pickedEvent = pickedEvent.replace('{Item-L}', `${item}`);

	// 				} else if (pickedEvent.includes('{Item-U}')) { // Using an item (does nothing to stats)

	// 					tribInv = db.tributes.get(tribute[0], 'inventory');
	// 					item = tribInv[Math.floor(Math.random() * tribInv.length)];
	// 					pickedEvent = pickedEvent.replace('{Item-U}', `${item}`);

	// 				}

	// 				// Handle Actions
	// 				if (pickedEvent.includes('[')) {
	// 					action = [pickedEvent.split('[')[1]];
	// 					action[0] = action[0].replace(']', '');
	// 					if (action[0].includes(',')) {
	// 						action[0] = action[0].split(', ');
	// 						action = action.flat(1);
	// 					}

	// 					console.log(action);
	// 					//Begin action checks
	// 					for (let i = 0; i < action.length; i++) {
	// 						if (action[i].includes('D')) { //D = Death

	// 							actTribNum = parseInt(action[i].split('U')[1].slice(0, -2)) - 1;
	// 							db.tributes.set(`${tribute[actTribNum]}`, 'Dead', 'status');
	// 							aliveArray = aliveArray.filter(key => key != tribute[actTribNum]);
	// 							db.tributes.set(`Alive`, aliveArray);
	// 							db.tributes.push(`Dead`, `${tribute[actTribNum]}`);
	// 							db.stats.math('Deaths Num', '+', 1);
	// 							db.stats.push('Deaths Users', `<@${tribute[actTribNum]}>`);
	// 							//remove_role(message, tribute[actTribNum], '771373653454880848'); //Remove alive role
	// 							//add_role(message, tribute[actTribNum], '783437440786104382'); // Add dead role

	// 						} else if (action[i].includes('K')) { //K = Kill
								
	// 							actTribNum = parseInt(action[i].split('U')[1].slice(0, -3)) - 1;
	// 							killNum = parseInt(action[i].split('K')[1]);
	// 							db.tributes.math(tribute[actTribNum], '+', killNum, 'kill_num');
			

	// 						} else if (action[i].includes('G')) { //G = Gone (from the Cornucopia)

	// 							actTribNum = parseInt(action[i].split('U')[1].slice(0, -2)) - 1;
	// 							db.tributes.set(tribute[actTribNum], false, 'in_corn');

	// 						} else { // Just taking Damage
								
	// 							actTribNum = parseInt(action[i].split('U')[1].slice(0, -2)) - 1;
	// 							dmgNum = parseInt(action[i].split('-')[1]);
	// 							tribHealth = db.tributes.get(tribute[actTribNum], 'health');
	// 							tribHealth -= dmgNum;
								
	// 							if (tribHealth <= 0) { // We dead
	// 								db.tributes.set(`${tribute[actTribNum]}`, 'Dead', 'status');
	// 								db.tributes.set(tribute[actTribNum], tribHealth, 'health');
	// 								aliveArray = aliveArray.filter(key => key != tribute[actTribNum]);
	// 								db.tributes.set(`Alive`, aliveArray);
	// 								db.tributes.push(`Dead`, `${tribute[actTribNum]}`);
	// 								//remove_role(message, tribute[actTribNum], '771373653454880848'); //Remove alive role
	// 								//add_role(message, tribute[actTribNum], '783437440786104382'); // Add dead role

	// 								db.stats.math('Deaths Num', '+', 1);
	// 								db.stats.push('Deaths Users', `<@${tribute[actTribNum]}>`);
	// 							} else { // We not dead
	// 								db.tributes.set(tribute[actTribNum], tribHealth, 'health');
	// 							}

	// 						}
	// 					}

	// 					if (action.length === 1) {
	// 						pickedEvent = pickedEvent.slice(0, -6);
	// 					} else {
	// 						pickedEvent = pickedEvent.slice(0, -13);
	// 					}

	// 				}

	// 				if (db.tributes.get(tribute[0], 'in_corn') === true) {
	// 					db.tributes.set(tribute[0], false, 'in_corn');
	// 				}

	// 				for (let i = 0; i < tribute.length; i++) {
	// 					if (tribute[i] != false) {
	// 						db.tributes.set(tribute[i], true, 'action');
	// 					}
	// 				}
					
	// 			}

	// 			if (message_to_send.includes('(override)')) {
	// 				message_to_send = message_to_send.replace('(override)', '');
	// 			} else {
	// 				message_to_send = pickedEvent;
	// 			}

	// 			// Update admin panel
	// 			updateGameStatus(message);
	// 			updateSponsorList(message);
	// 			updateUserStatus(message);

	// 			message.channel.send(message_to_send);
	// 			setTimeout(eventPicker, gameIntervalTime);
	// 		} else {
	// 			tributeArray = db.tributes.keyArray();
	// 			tributeArray = tributeArray.filter(key => db.tributes.get(key, 'status') === 'Alive');
	// 			tributeArray = tributeArray.filter(key => key != 'Dead');
	// 			tributeArray = tributeArray.filter(key => key != 'Alive');

	// 			message.channel.send(`𝔗𝔥𝔢 𝔚𝔦𝔫𝔫𝔢𝔯 𝔬𝔣 𝔱𝔥𝔢 𝕸𝖚𝖗𝖉𝖊𝖗 𝕽𝖔𝖞𝖆𝖑𝖊 𝔦𝔰 <@${tributeArray[0]}>!`);
	// 		}

	// 	};

	// 	setTimeout(eventPicker, gameIntervalTime);
	// }
	//#endregion

	// Schedule Message Command
	if (message.content.includes('!schedule')) { 
		if (message.author.id == '122568101995872256' || message.author.id == '145267507844874241') {
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

				db.global_bot.push('msg_timestamps', {channel: channelId, time: scheduleTime, msg: scheduleMsg});
				outputMsgs.push(`**${scheduleMsg}** (on <t:${unixTimestamp}:f>)`)
	
				cron.schedule(scheduleTime, () => { 
					channelToSend.send(scheduleMsg);
					let timestamps = db.global_bot.get('msg_timestamps');
					timestamps = timestamps.filter(v => v.time != scheduleTime && v.msg != scheduleMsg);
					db.global_bot.set('msg_timestamps', timestamps);
				}, {
					scheduled: true,
				});	
			}
		
			message.channel.send(`## Message Schedule Summary\nOutput Channel: <#${channelId}>\n-----------------------------------------------------------\n${outputMsgs.join('\n')}`);
		}
	}

	if (message.content.includes('React first to claim')) {
		message.react('🔑');

		const filter = (reaction, user) => {
			crateUsrID = user.id;
			return ['🔑'].includes(reaction.emoji.name) && (user.id != message.author.id);
		};

		await message.awaitReactions({ filter, max: 1 })
			.then(collected => {
				const reaction = collected.first();
		
				if (reaction.emoji.name === '🔑') {
					let crateAmt = 0;

					if (message.content.includes('PINAPL CRATE')) {
						crateAmt = Math.round(randomNumber(5, 30));
						message.channel.send(`<@${crateUsrID}> has claimed the crate.\nYou find **${crateAmt}** <:pp:772971222119612416>! Congratulations!`);
						db.balances.math(crateUsrID, '+', crateAmt);
						db.profile.math(crateUsrID, '+', 1, 'casino.crates');

					} else if (message.content.includes('TRICKY CRATE')) {
						let chance = weighted_random(trickyChance);
						console.log(crateUsrID);
						if (chance === 'give') {
							crateAmt = Math.round(randomNumber(20, 50));
							message.channel.send(`<@${crateUsrID}> has claimed the crate.\nYou find **${crateAmt}** <:pp:772971222119612416>! Congratulations!`);
							db.balances.math(crateUsrID, '+', crateAmt);
							db.profile.math(crateUsrID, '+', 1, 'casino.crates');
						} else if (chance === 'take') {
							crateAmt = Math.round(randomNumber(1, 50));
							message.channel.send(`<@${crateUsrID}> has claimed the crate.\n A hand comes out of the crate, reaches into your pocket, and steals **${crateAmt}** <:pp:772971222119612416>! Congratulations!`);
							db.balances.math(crateUsrID, '-', crateAmt);
							db.profile.math(crateUsrID, '+', 1, 'casino.crates');
						}

					} else if (message.content.includes('KING CRATE')) {
						crateAmt = Math.round(randomNumber(50, 500));
						message.channel.send(`<@${crateUsrID}> has claimed the crate.\nYou find **${crateAmt}** <:pp:772971222119612416>! Congratulations!`);
						db.balances.math(crateUsrID, '+', crateAmt);
						db.profile.math(crateUsrID, '+', 1, 'casino.crates');
					}

				}
			});
	}	
});

// login to Discord
client.login(token);

