const Discord = require('discord.js');
const fs = require('fs');
const { prefix, token } = require('./config.json');
const db = require("./db.js");
const cron = require("node-cron");
const { add_role, remove_role } = require('./func');

// Set up random number function
function randomNumber(min, max) {  
    return Math.random() * (max - min) + min; 
}  

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
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
let intervalTime = randomNumber(4.32e+7, 1.008e+8);
let doCooldown = true;
console.log(intervalTime);

client.once('ready', () => {
	console.log('Ready!');
	const date = new Date().toLocaleTimeString().replace("/.*(d{2}:d{2}:d{2}).*/", "$1");
    console.log(date);
});
	
const myFunction = function() {
	const channel = client.channels.cache.get('771373426664275980');
	(channel.send('📦 PINAPL CRATE 📦\n*React first to claim!*'));
	intervalTime = randomNumber(4.32e+7, 1.008e+8);
	setTimeout(myFunction, intervalTime);
	console.log(intervalTime);
};
setTimeout(myFunction, intervalTime);

// Send the workers a message at 10am PST
cron.schedule('00 11 * * *', () => { 
	const workchannel = client.channels.cache.get('809854279552598016');
	workchannel.send('Rise and shine employees of Citrus Inc.! Another day has passed, and now you can all work.\nDon\'t forget, you can use `!work` to work!');
	db.workList.set('workerList', []);
}, {
    scheduled: true,
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
						case 'botanon': add_role(fullmessage.message, user, '771383105252491306'); break;
						case 'botglad': add_role(fullmessage.message, user, '772870869583527947'); break;
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
						case 'botanon': remove_role(fullmessage.message, user, '771383105252491306'); break;
						case 'botglad': remove_role(fullmessage.message, user, '772870869583527947'); break;
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
client.on('message', async message => {

    let args = message.content.slice(prefix.length).trim().split(/ +/);
    let commandName = args.shift().toLowerCase();

    if (args.length > 1) {
		args = message.content.slice(prefix.length).trim().split(/ \| +/);
        const firstargs = args[0].split(/ +/);
        commandName = firstargs.shift().toLowerCase();  
        args[0] = args[0].slice(commandName.length + 1).trim(); 
    }
	if (message.content.includes('Invalid amount to bet!')) doCooldown = false;

	if (message.content.includes('📦 PINAPL CRATE 📦\n*React first to claim!*')) {
		message.react('🔑');

		const filter = (reaction, user) => {
			crateUsrID = user.id;
			return ['🔑'].includes(reaction.emoji.name) && (user.id != message.author.id);
		};
		message.awaitReactions(filter, { max: 1 })
			.then(collected => {
				const reaction = collected.first();
		
				if (reaction.emoji.name === '🔑') {
					let crateAmt = Math.round(randomNumber(1, 30));
					message.channel.send(`<@${crateUsrID}> has claimed the crate.\nYou find **${crateAmt}** <:pp:772971222119612416>! Congratulations!`);
					db.balances.math(crateUsrID, '+', crateAmt);
				}
			});
	}	

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	if (message.content === '!collect' || message.content === '!work') {
		if (db.workList.get('workerList').includes(parseInt(message.author.id))) return message.channel.send('You feel pretty tired... You won\'t be able to work for a while.');
		message.channel.send('You work diligently and get 15 <:pp:772971222119612416> for your hard work. Good job!\nYou won\'t be able to mine for a while.');
		db.balances.math(message.author.id, '+', 15);
		db.workList.push('workerList', parseInt(message.author.id));
	}

	const command = client.commands.get(commandName) ||	client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`!${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);	
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(0)} more second(s) before reusing the \`${command.name}\` command.`);
        }

    }

	if (doCooldown === false) {
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); 
	} else {
		doCooldown = true;
	}

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(`There was an error trying to execute that command!\nMessage sent: \`${message.content}\``);
    }

});

// login to Discord
client.login(token);

