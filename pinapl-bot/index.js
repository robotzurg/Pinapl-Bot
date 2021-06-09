const Discord = require('discord.js');
const fs = require('fs');
const { token } = require('./config.json');
const db = require("./db.js");
const cron = require("node-cron");
const { add_role, remove_role, weighted_random } = require('./func');
const { crateChance, trickyChance } = require('./arrays.json');

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
	const command_list = await client.guilds.cache.get('771373425734320159')?.commands.cache.array();
	for (let i = 0; i < command_list.length; i++) {
		if (admin_list.includes(command_list[i].name)) {
			perm_command = await client.guilds.cache.get('771373425734320159')?.commands.fetch(command_list[i].id);
			permissions = [
				{
					id: '816362263316529215',
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
client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	await interaction.defer();

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
client.on('message', message => {

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

