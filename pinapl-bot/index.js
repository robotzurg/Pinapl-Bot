const Discord = require('discord.js');
const fs = require('fs');
const { token } = require('./config.json');
const db = require("./db.js");
const cron = require("node-cron");
const { add_role, remove_role, weighted_random, updateGameStatus, updateSponsorList, updateUserStatus } = require('./func');
const { crateChance, trickyChance, bloodbathEvents, miscEvents, attackEvents, injuryEvents, itemEvents, nightEvents, cornTypeChoices, dayTypeChoices, nightTypeChoices, final3TypeChoices } = require('./arrays.json');

// Set up random number function
function randomNumber(min, max) {  
    return Math.random() * (max - min) + min; 
}  
// create a new Discord client and give it some variables
const { Client, Intents } = require('discord.js');
const myIntents = new Intents();
myIntents.add('GUILD_PRESENCES', 'GUILD_MEMBERS');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();

// Command Collections
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

let crateUsrID;
let intervalTime = randomNumber(2.16e+7, 4.32e+7);
console.log(intervalTime);

client.once('ready', async () => {
    const data = [];
	const admin_list = [];
	let permissions;
    client.commands.forEach(function(value, key) {
        data.push({
            name: key,
            description: value.description,
            options: value.options,
			defaultPermission: !value.admin,
        });
		if (value.admin === true) {
			admin_list.push(key);
		}
    });
    await client.guilds.cache.get('771373425734320159')?.commands.set(data);
	let perm_command;
	const command_list = await client.guilds.cache.get('771373425734320159')?.commands.cache.keys();
	for (let i = 0; i < command_list.length; i++) {
		if (admin_list.includes(command_list[i].name)) {
			perm_command = await client.guilds.cache.get('771373425734320159')?.commands.fetch(command_list[i].id);
			permissions = [
				{
					id: '816362263316529215',
					type: 'ROLE',
					permission: true,
				}, {
					id: '850097732462706729',
					type: 'ROLE',
					permission: true,
				},
			];
			await perm_command.setPermissions(permissions);
		}
	}

    console.log('Ready!');
    const date = new Date().toLocaleTimeString().replace("/.*(d{2}:d{2}:d{2}).*/", "$1");
    console.log(date);
});

	
const myFunction = function() {
	const channel = client.channels.cache.get('771373426664275980');
	const cratePick = weighted_random(crateChance);

	switch(cratePick) {
		case 'pinapl': channel.send('<:botglad:773273503645696060> PINAPL CRATE <:botglad:773273503645696060>\n*React first to claim!*'); break;
		case 'tricky': channel.send('<:botcat:776126782805377034> TRICKY CRATE <:botcat:776126782805377034>\n*React first to claim!*'); break;
		case 'king': channel.send('<:botking:773959160110121031> KING CRATE <:botking:773959160110121031>\n*React first to claim!*'); break;
	}
	
	intervalTime = randomNumber(2.16e+7, 4.32e+7);
	setTimeout(myFunction, intervalTime);
};
setTimeout(myFunction, intervalTime);

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

	await interaction.deferReply();

    const command = client.commands.get(interaction.commandName);

	if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return interaction.editReply(`please wait ${timeLeft.toFixed(0)} more second(s) before reusing the \`${command.name}\` command.`);
        }

    }

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount); 

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
});

client.on("messageReactionAdd", function(messageReaction, user) {
	if (messageReaction.message.id === '833766691740844052' || messageReaction.message.id === '833766713862127626' || messageReaction.message.id === '833766740893892610' ||
	messageReaction.message.id === '833766769155899443' || messageReaction.message.id === '833766812012904448') {

		messageReaction.fetch()
		.then(fullmessage => {
			// Add roles based on the message
			switch(messageReaction.message.id) {
				case '833766691740844052': // Pronouns
					switch(messageReaction.emoji.name) {
						case '♂️': add_role(fullmessage.message, user, '771485020618883083'); break;
						case '♀️': add_role(fullmessage.message, user, '771485038487404554'); break;
						case '⚧': add_role(fullmessage.message, user, '771485053938958377'); break;
					}
				break;

				case '833766713862127626': // Ping Preference
					switch(messageReaction.emoji.name) {
						case 'botsleep': add_role(fullmessage.message, user, '771383105252491306'); break;
						case 'botelite': add_role(fullmessage.message, user, '772870869583527947'); break;
						case 'botjeff': add_role(fullmessage.message, user, '844273916101132338'); break;
						case 'botwoke': add_role(fullmessage.message, user, '844274054193610843'); break;
					}
				break;

				case '833766740893892610': // Extra opt-in stuff
					switch(messageReaction.emoji.name) {
						case '🍓': add_role(fullmessage.message, user, '802293656396103700'); break;
						case '🥝': add_role(fullmessage.message, user, '833753177698467840'); break;
						case '🪵': add_role(fullmessage.message, user, '833758889321300010'); break; // This is wood, for some reason
					}
				break;

				case '833766769155899443': // Restrict access
					switch(messageReaction.emoji.name) {
						case '🍈': add_role(fullmessage.message, user, '810923161079644161'); break;
						case '🍋': add_role(fullmessage.message, user, '809853738080534558'); break;
						case '👻': add_role(fullmessage.message, user, '777964201255501855'); break;
						case '🍎': add_role(fullmessage.message, user, '836624845256917023'); break; 
					}
				break;

				case '833766812012904448': // Districts
					switch(messageReaction.emoji.name) {
						case 'botdanish': add_role(fullmessage.message, user, '776119639880106025'); break;
						case 'Kerchow': add_role(fullmessage.message, user, '776119791215050802'); break;
						case 'pinapl': add_role(fullmessage.message, user, '776118809839927317'); break; 
						case 'bot_h': add_role(fullmessage.message, user, '776119931934474315'); break; 
						case 'botvibe': add_role(fullmessage.message, user, '776119551250792459'); break; 
						case 'botcry': add_role(fullmessage.message, user, '776129405491347507'); break; // Oceans District
						case 'botbridge': add_role(fullmessage.message, user, '776129887449907230'); break; 
						case 'botbot': add_role(fullmessage.message, user, '776120277615902720'); break; 
						case 'cbotmagenta': add_role(fullmessage.message, user, '776129262980956170'); break; 
						case 'botcatpink': add_role(fullmessage.message, user, '776128714752524289'); break; 
						case 'dougdimmabot': add_role(fullmessage.message, user, '776129824397328396'); break; 
						case 'bot4': add_role(fullmessage.message, user, '776119435966283806'); break; 
					}
				break;
			}

		})	
		.catch(error => {
			console.log('Something went wrong when fetching the message: ', error);
		});
	}
});

client.on("messageReactionRemove", function(messageReaction, user) {
	if (messageReaction.message.id === '833766691740844052' || messageReaction.message.id === '833766713862127626' || messageReaction.message.id === '833766740893892610' ||
	messageReaction.message.id === '833766769155899443' || messageReaction.message.id === '833766812012904448') {

		messageReaction.fetch()
		.then(fullmessage => {
			// Add roles based on the message
			switch(messageReaction.message.id) {
				case '833766691740844052': // Pronouns
					switch(messageReaction.emoji.name) {
						case '♂️': remove_role(fullmessage.message, user, '771485020618883083'); break;
						case '♀️': remove_role(fullmessage.message, user, '771485038487404554'); break;
						case '⚧': remove_role(fullmessage.message, user, '771485053938958377'); break;
					}
				break;

				case '833766713862127626': // Ping Preference
					switch(messageReaction.emoji.name) {
						case 'botsleep': remove_role(fullmessage.message, user, '771383105252491306'); break;
						case 'botelite': remove_role(fullmessage.message, user, '772870869583527947'); break;
						case 'botjeff': remove_role(fullmessage.message, user, '844273916101132338'); break;
						case 'botwoke': remove_role(fullmessage.message, user, '844274054193610843'); break;
					}
				break;

				case '833766740893892610': // Extra opt in stuff
					switch(messageReaction.emoji.name) {
						case '🍓': remove_role(fullmessage.message, user, '802293656396103700'); break;
						case '🥝': remove_role(fullmessage.message, user, '833753177698467840'); break;
						case '🪵': remove_role(fullmessage.message, user, '833758889321300010'); break; // This is wood, for some reason
					}
				break;

				case '833766769155899443': // Restrict access
					switch(messageReaction.emoji.name) {
						case '🍈': remove_role(fullmessage.message, user, '810923161079644161'); break;
						case '🍋': remove_role(fullmessage.message, user, '809853738080534558'); break;
						case '👻': remove_role(fullmessage.message, user, '777964201255501855'); break; 
						case '🍎': remove_role(fullmessage.message, user, '836624845256917023'); break; 
					}
				break;

				case '833766812012904448': // Districts
					switch(messageReaction.emoji.name) {
						case 'botdanish': remove_role(fullmessage.message, user, '776119639880106025'); break;
						case 'Kerchow': remove_role(fullmessage.message, user, '776119791215050802'); break;
						case 'pinapl': remove_role(fullmessage.message, user, '776118809839927317'); break; 
						case 'bot_h': remove_role(fullmessage.message, user, '776119931934474315'); break; 
						case 'botvibe': remove_role(fullmessage.message, user, '776119551250792459'); break; 
						case 'botcry': remove_role(fullmessage.message, user, '776129405491347507'); break; // Oceans District
						case 'botbridge': remove_role(fullmessage.message, user, '776129887449907230'); break; 
						case 'botbot': remove_role(fullmessage.message, user, '776120277615902720'); break; 
						case 'cbotmagenta': remove_role(fullmessage.message, user, '776129262980956170'); break; 
						case 'botcatpink': remove_role(fullmessage.message, user, '776128714752524289'); break; 
						case 'dougdimmabot': remove_role(fullmessage.message, user, '776129824397328396'); break; 
						case 'bot4': remove_role(fullmessage.message, user, '776119435966283806'); break; 
					}
				break;
			}
		})
		.catch(error => {
			console.log('Something went wrong when fetching the message: ', error);
		});
	}
});

// Listen for messages
client.on('messageCreate', message => {

	// This bottom block of code is the entire hunger games sim code. Be careful when messing with it.
	if (message.content.includes('The games will now begin!') && (message.author.id === '818709319084015616' || message.author.id === '122568101995872256')) {
		let gameIntervalTime = 100;
		let t_choice = cornTypeChoices;
		let tributeArray = db.tributes.keyArray();
		let aliveArray = db.tributes.get('Alive');
		console.log('Initializing...');
		// db.stats.set('Game Status', 'Cornucopia');
		let corn_check = false;
		let message_to_send = /*`(override) ${db.tributes.keyArray().length - 2} tributes look around at one another, and then at the Cornucopia.\nEach contestant has the strength to win... Will they succeed?\n
		:sunny: Dawn of Day 1: **The Cornucopia!** 🌽`;*/ 'fix';
		let airdrop_array = [];
		let airdrop_items = [];
		let corn_items = [];
		let corn_start_time = Date.now();

		const eventPicker = function() {

			if (db.tributes.get('Alive').length != 1) {

				tributeArray = db.tributes.keyArray();
				tributeArray = tributeArray.filter(key => key != 'Dead');
				tributeArray = tributeArray.filter(key => key != 'Alive');
				tributeArray = tributeArray.filter(key => db.tributes.get(key, 'status') === 'Alive');
				aliveArray = db.tributes.get('Alive');
				let time = new Date().toISOString().split('T')[1].slice(0, -8);
				let typeArray = false;
				let tribute = [false, false]; //Tributes 1 and 2
				let gameStatus = db.stats.get('Game Status');
				let dayNum = db.stats.get('Day');
				let pickedEvent;
				let tribPostedName = [];

				if (gameStatus === 'Day') {
					gameIntervalTime = 1800000;
				}

				switch (gameStatus) {
					case "Cornucopia": t_choice = cornTypeChoices; break;
					case "Day": t_choice = dayTypeChoices; break;
					case "Night": t_choice = nightTypeChoices; break;
					case "Transition To Day": t_choice = dayTypeChoices; break;
					case "Transition To Night": t_choice = dayTypeChoices; break;
				}

				if (aliveArray.length <= 3) {
					t_choice = final3TypeChoices;
				}

				airdrop_array = [];
				corn_items = db.airdrop.keyArray();
				airdrop_items = db.priority_airdrop.keyArray();

				if (!message_to_send.includes('Each contestant has the strength')) {
					message_to_send = 'Awaiting Event';
				}

				// Airdrops!
				if (gameStatus === 'Transition To Day' && tributeArray.length > 6) { //Airdrop time
					for (let i = 0; i < tributeArray.length; i++) {
						let rand_drop;
						if (airdrop_items.length != 0) {
							rand_drop = airdrop_items[Math.floor(Math.random() * airdrop_items.length)];
							airdrop_items = airdrop_items.filter(key => key != rand_drop);
							db.priority_airdrop.delete(rand_drop);
						} else {
							rand_drop = corn_items[Math.floor(Math.random() * airdrop_items.length)];
							corn_items = corn_items.filter(key => key != rand_drop);
							db.airdrop.delete(rand_drop);
						}

						airdrop_array.push(`<@${tributeArray[i]}> receives a ${rand_drop}`);
					}

					message_to_send = `(override) :sunny: Dawn of **Day ${dayNum}** :sunny:\n*${aliveArray.length} tributes remain.*\nThe daily airdrops begin to fall from the sky...\n\n:package: **Daily Airdrops** :package:
					\n${airdrop_array.join('\n')}`;

					gameStatus = 'Day';
					db.stats.set('Time', 'Day');
					db.stats.set('Game Status', 'Day');
					gameIntervalTime = 1800000;
					let tempTribArray = db.tributes.keyArray();
					tempTribArray = tempTribArray.filter(key => key != 'Alive');
					tempTribArray = tempTribArray.filter(key => key != 'Dead');
					for (let i = 0; i < tempTribArray.length; i++) {
						console.log(tempTribArray[i]);
						db.tributes.set(tempTribArray[i], false, 'action');
					}

					db.priority_airdrop.clear();
					for (let i = 0; i < db.backpack.keyArray().length; i++) {
						db.backpack.set(db.backpack.keyArray()[i], false, 'sponsored_item');
					}

				} else if (gameStatus === 'Transition To Day') { // If the last 6 people are left, no airdrops.

					message_to_send = `(override) :sunny: Dawn of **Day ${dayNum}** :sunny:\n*${aliveArray.length} tributes remain.*`;

					gameStatus = 'Day';
					db.stats.set('Time', 'Day');
					db.stats.set('Game Status', 'Day');
					gameIntervalTime = 1800000;
					let tempTribArray = db.tributes.keyArray();
					tempTribArray = tempTribArray.filter(key => key != 'Alive');
					tempTribArray = tempTribArray.filter(key => key != 'Dead');
					for (let i = 0; i < tempTribArray.length; i++) {
						console.log(tempTribArray[i]);
						db.tributes.set(tempTribArray[i], false, 'action');
					}

				} else if (gameStatus === 'Transition To Night') { // Night transition
					message_to_send = `(override) :crescent_moon: Night of **Day ${dayNum}**. :stars:`;
					gameStatus = 'Night';
					db.stats.set('Game Status', 'Night');
					db.stats.set('Time', 'Night');
				}

				if (gameStatus === "Cornucopia") corn_check = false;

				let tribInv;
				let airdropInv;
				let item = false;

				let action = false;
				let actTribNum;
				let killNum;
				let dmgNum;
				let tribHealth;
				let type;

				if (gameStatus === 'Cornucopia') {
					for (let i = 0; i < tributeArray.length; i++) {
						if (db.tributes.get(tributeArray[i], 'in_corn') === true) {
							corn_check = true;
						}
					}

					if (corn_check === false) {
						console.log('Done with Cornucopia');
						gameStatus = 'Day';
						db.stats.set('Game Status', 'Day');
						db.stats.set('Time', 'Day');
						message_to_send = '(override) The Cornucopia lays abandoned, and the remaining tributes flee to their own destinations...\n:sunny: Day 1: **The Games Begin!** :crossed_swords:';
						gameIntervalTime = 3.6e+6 - (Date.now() - corn_start_time);

						let tempTribArray = db.tributes.keyArray();
						tempTribArray = tempTribArray.filter(key => key != 'Alive');
						tempTribArray = tempTribArray.filter(key => key != 'Dead');
						for (let i = 0; i < tempTribArray.length; i++) {
							db.tributes.set(tempTribArray[i], false, 'action');
						}
					}
				}

				// Filter out tributes
				if (gameStatus === 'Cornucopia') {
					tributeArray = tributeArray.filter(key => db.tributes.get(key, 'in_corn') === true);
				} else if (gameStatus === 'Day' || gameStatus === 'Night') {
					tributeArray = tributeArray.filter(key => db.tributes.get(key, 'action') === false);
					if (tributeArray.length === 0) {
						for (let i = 0; i < tributeArray.length; i++) {
							db.tributes.set(tributeArray[i], false, 'action');
						}
						tributeArray = db.tributes.keyArray();
						tributeArray = tributeArray.filter(key => key != 'Dead');
						tributeArray = tributeArray.filter(key => key != 'Alive');
						tributeArray = tributeArray.filter(key => db.tributes.get(key, 'status') === 'Alive');
					}
				}

				//Day/Night Switch
				if (gameStatus === 'Day' && time === '21:00') {
					message_to_send = `(override) As the eventful day starts to set, our tributes begin to wind down for the night.\nIn the distance, ${db.stats.get('Deaths Num')} cannonshots are heard.\n\n${db.stats.get('Deaths Users').join('\n')}\n\nThese tributes have fallen. React :regional_indicator_f: to pay respects.`;
					db.stats.set('Game Status', 'Transition To Night');
					db.stats.set('Time', 'Night');
					db.stats.set('Deaths Num', 0);
					db.stats.set('Deaths Users', []);

					let tempTribArray = db.tributes.keyArray();
					tempTribArray = tempTribArray.filter(key => key != 'Alive');
					tempTribArray = tempTribArray.filter(key => key != 'Dead');
					for (let i = 0; i < tempTribArray.length; i++) {
						console.log(tempTribArray[i]);
						db.tributes.set(tempTribArray[i], false, 'action');
					}

					gameStatus === 'Transition To Night';
				} else if (gameStatus === 'Night' && time === '03:00') {
					message_to_send = `(override) The arena grows quieter as the tributes drift off to sleep. :zzz: \nEnd of **Day ${dayNum}**`;
					db.stats.set('Game Status', 'Transition To Day');
					db.stats.set('Time', 'Day');
					db.stats.math('Day', '+', 1);

					let tempTribArray = db.tributes.keyArray();
					tempTribArray = tempTribArray.filter(key => key != 'Alive');
					tempTribArray = tempTribArray.filter(key => key != 'Dead');
					for (let i = 0; i < tempTribArray.length; i++) {
						console.log(tempTribArray[i]);
						db.tributes.set(tempTribArray[i], false, 'action');
					}

					gameIntervalTime = 3.78e+7; // Takes us to 10.5 hours ahead, landing us at

					gameStatus === 'Transition To Day';
				}

				if (!message_to_send.includes('(override)')) {
				
					// Pick Tribute
					tribPostedName = [];
					tribute[0] = tributeArray[Math.floor(Math.random() * tributeArray.length)];
					console.log(`Tribute: ${message.guild.members.cache.get(tribute[0]).displayName}`);
					console.log(`Status: ${gameStatus}`);
					tribInv = db.tributes.get(tribute[0], 'inventory');

					if (db.backpack.get(tribute[0], 'no_ping') === true) {
						tribPostedName.push(`**${message.guild.members.cache.get(tribute[0]).displayName}**`);
					} else {
						tribPostedName.push(`<@${tribute[0]}>`);
					}
					
					if (tribInv.length === 0) t_choice = t_choice.filter(key => key.item != 'item');

					if (message_to_send.includes('(override)')) {
						type = false;
					} else {
						type = weighted_random(t_choice);
					}
				}

				// Figure out which array type we are using
				switch (type) {
					case 'bb': typeArray = bloodbathEvents; break;
					case 'misc': typeArray = miscEvents; break;
					case 'attack': typeArray = attackEvents; break;
					case 'injury': typeArray = injuryEvents; break;
					case 'item': typeArray = itemEvents; break;
					case 'night': typeArray = nightEvents; break;
					default: typeArray = false;
				}
				if (!typeArray === false) {

					pickedEvent = typeArray[Math.floor(Math.random() * typeArray.length)];
					// Pick an event
					// Replace tribute 1 with the tribute we have
					pickedEvent = pickedEvent.replace('(Tribute 1)', tribPostedName[0]);

					// If there is a second tribute
					if (pickedEvent.includes('(Tribute 2)')) {
						while (tribute[0] === tribute[1] || tribute[1] === false) {
							let tempTribArray = db.tributes.keyArray();
							tempTribArray = tempTribArray.filter(key => key != 'Dead');
							tempTribArray = tempTribArray.filter(key => key != 'Alive');
							tempTribArray = tempTribArray.filter(key => db.tributes.get(key, 'status') === 'Alive');
							tribute[1] = tempTribArray[Math.floor(Math.random() * tempTribArray.length)];
						}

						if (db.backpack.get(tribute[1], 'no_ping') === true) {
							tribPostedName.push(`**${message.guild.members.cache.get(tribute[0]).displayName}**`);
						} else {
							tribPostedName.push(`<@${tribute[1]}>`);
						}

						pickedEvent = pickedEvent.replace('(Tribute 2)', tribPostedName[1]);
						console.log(`Tribute: ${message.guild.members.cache.get(tribute[1]).displayName}`);
					}

					// Handle Items
					if (pickedEvent.includes('{Item-G}')) { // Gaining an item

						airdropInv = db.airdrop.keyArray();
						item = airdropInv[Math.floor(Math.random() * airdropInv.length)];
						db.airdrop.delete(item);
						db.tributes.push(tribute[0], item, 'inventory');
						pickedEvent = pickedEvent.replace('{Item-G}', `${item}`);

					} else if (pickedEvent.includes('{Item-L}')) { // Loss of an item

						tribInv = db.tributes.get(tribute[0], 'inventory');
						item = tribInv[Math.floor(Math.random() * tribInv.length)];
						tribInv = tribInv.filter(key => key != item);
						db.tributes.set(tribute[0], tribInv, 'inventory');
						pickedEvent = pickedEvent.replace('{Item-L}', `${item}`);

					} else if (pickedEvent.includes('{Item-U}')) { // Using an item (does nothing to stats)

						tribInv = db.tributes.get(tribute[0], 'inventory');
						item = tribInv[Math.floor(Math.random() * tribInv.length)];
						pickedEvent = pickedEvent.replace('{Item-U}', `${item}`);

					}

					// Handle Actions
					if (pickedEvent.includes('[')) {
						action = [pickedEvent.split('[')[1]];
						action[0] = action[0].replace(']', '');
						if (action[0].includes(',')) {
							action[0] = action[0].split(', ');
							action = action.flat(1);
						}

						console.log(action);
						//Begin action checks
						for (let i = 0; i < action.length; i++) {
							if (action[i].includes('D')) { //D = Death

								actTribNum = parseInt(action[i].split('U')[1].slice(0, -2)) - 1;
								db.tributes.set(`${tribute[actTribNum]}`, 'Dead', 'status');
								aliveArray = aliveArray.filter(key => key != tribute[actTribNum]);
								db.tributes.set(`Alive`, aliveArray);
								db.tributes.push(`Dead`, `${tribute[actTribNum]}`);
								db.stats.math('Deaths Num', '+', 1);
								db.stats.push('Deaths Users', `<@${tribute[actTribNum]}>`);
								//remove_role(message, tribute[actTribNum], '771373653454880848'); //Remove alive role
								//add_role(message, tribute[actTribNum], '783437440786104382'); // Add dead role

							} else if (action[i].includes('K')) { //K = Kill
								
								actTribNum = parseInt(action[i].split('U')[1].slice(0, -3)) - 1;
								killNum = parseInt(action[i].split('K')[1]);
								db.tributes.math(tribute[actTribNum], '+', killNum, 'kill_num');
			

							} else if (action[i].includes('G')) { //G = Gone (from the Cornucopia)

								actTribNum = parseInt(action[i].split('U')[1].slice(0, -2)) - 1;
								db.tributes.set(tribute[actTribNum], false, 'in_corn');

							} else { // Just taking Damage
								
								actTribNum = parseInt(action[i].split('U')[1].slice(0, -2)) - 1;
								dmgNum = parseInt(action[i].split('-')[1]);
								tribHealth = db.tributes.get(tribute[actTribNum], 'health');
								tribHealth -= dmgNum;
								
								if (tribHealth <= 0) { // We dead
									db.tributes.set(`${tribute[actTribNum]}`, 'Dead', 'status');
									db.tributes.set(tribute[actTribNum], tribHealth, 'health');
									aliveArray = aliveArray.filter(key => key != tribute[actTribNum]);
									db.tributes.set(`Alive`, aliveArray);
									db.tributes.push(`Dead`, `${tribute[actTribNum]}`);
									//remove_role(message, tribute[actTribNum], '771373653454880848'); //Remove alive role
									//add_role(message, tribute[actTribNum], '783437440786104382'); // Add dead role

									db.stats.math('Deaths Num', '+', 1);
									db.stats.push('Deaths Users', `<@${tribute[actTribNum]}>`);
								} else { // We not dead
									db.tributes.set(tribute[actTribNum], tribHealth, 'health');
								}

							}
						}

						if (action.length === 1) {
							pickedEvent = pickedEvent.slice(0, -6);
						} else {
							pickedEvent = pickedEvent.slice(0, -13);
						}

					}

					if (db.tributes.get(tribute[0], 'in_corn') === true) {
						db.tributes.set(tribute[0], false, 'in_corn');
					}

					for (let i = 0; i < tribute.length; i++) {
						if (tribute[i] != false) {
							db.tributes.set(tribute[i], true, 'action');
						}
					}
					
				}

				if (message_to_send.includes('(override)')) {
					message_to_send = message_to_send.replace('(override)', '');
				} else {
					message_to_send = pickedEvent;
				}

				// Update admin panel
				updateGameStatus(message);
				updateSponsorList(message);
				updateUserStatus(message);

				message.channel.send(message_to_send);
				setTimeout(eventPicker, gameIntervalTime);
			} else {
				tributeArray = db.tributes.keyArray();
				tributeArray = tributeArray.filter(key => db.tributes.get(key, 'status') === 'Alive');
				tributeArray = tributeArray.filter(key => key != 'Dead');
				tributeArray = tributeArray.filter(key => key != 'Alive');

				message.channel.send(`𝔗𝔥𝔢 𝔚𝔦𝔫𝔫𝔢𝔯 𝔬𝔣 𝔱𝔥𝔢 𝕸𝖚𝖗𝖉𝖊𝖗 𝕽𝖔𝖞𝖆𝖑𝖊 𝔦𝔰 <@${tributeArray[0]}>!`);
			}

		};

		setTimeout(eventPicker, gameIntervalTime);
	}

	if (message.content.includes('React first to claim')) {
		message.react('🔑');

		const filter = (reaction, user) => {
			crateUsrID = user.id;
			return ['🔑'].includes(reaction.emoji.name) && (user.id != message.author.id);
		};
		message.awaitReactions(filter, { max: 1 })
			.then(collected => {
				const reaction = collected.first();
		
				if (reaction.emoji.name === '🔑') {
					let crateAmt = 0;

					if (message.content.includes('PINAPL CRATE')) {
						crateAmt = Math.round(randomNumber(5, 30));
						message.channel.send(`<@${crateUsrID}> has claimed the crate.\nYou find **${crateAmt}** <:pp:772971222119612416>! Congratulations!`);
						db.balances.math(crateUsrID, '+', crateAmt);

					} else if (message.content.includes('TRICKY CRATE')) {
						let chance = weighted_random(trickyChance);
						console.log(crateUsrID);
						if (chance === 'give') {
							crateAmt = Math.round(randomNumber(20, 50));
							message.channel.send(`<@${crateUsrID}> has claimed the crate.\nYou find **${crateAmt}** <:pp:772971222119612416>! Congratulations!`);
							db.balances.math(crateUsrID, '+', crateAmt);
						} else if (chance === 'take') {
							crateAmt = Math.round(randomNumber(1, 50));
							message.channel.send(`<@${crateUsrID}> has claimed the crate.\n A hand comes out of the crate, reaches into your pocket, and steals **${crateAmt}** <:pp:772971222119612416>! Congratulations!`);
							db.balances.math(crateUsrID, '-', crateAmt);
						}

					} else if (message.content.includes('KING CRATE')) {
						crateAmt = Math.round(randomNumber(50, 500));
						message.channel.send(`<@${crateUsrID}> has claimed the crate.\nYou find **${crateAmt}** <:pp:772971222119612416>! Congratulations!`);
						db.balances.math(crateUsrID, '+', crateAmt);

					}

				}
			});
	}	
});

// login to Discord
client.login(token);

