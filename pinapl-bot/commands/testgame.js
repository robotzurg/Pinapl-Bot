const db = require("../db");
const { bloodbathEvents, miscEvents, attackEvents, injuryEvents, itemEvents, nightEvents, cornTypeChoices, dayTypeChoices, nightTypeChoices, final3TypeChoices } = require("../arrays.json");
const { updateGameStatus, updateSponsorList, updateUserStatus, getTimeDif } = require("../func");
//const { remove_role, add_role, updateGameStatus, updateSponsorList, updateUserStatus } = require("../func");

module.exports = {
	name: 'testgame',
    description: 'Test a game of pinapl\'s murder royale!',
	options: [],
	admin: true,
	execute(interaction) {

		let intervalTime = 60000;
		let t_choice = cornTypeChoices;
		let tributeArray = db.tributes.keyArray();
		let aliveArray = db.tributes.get('Alive');
		console.log('Initializing...');
		db.stats.set('Game Status', 'Cornucopia');
		let corn_check = false;
		let message_to_send = `(override) ${db.tributes.keyArray().length - 2} tributes look around at one another, and then at the Cornucopia.\nEach contestant has the strength to win... Will they succeed?\n
		:sunny: Dawn of Day 1: **The Cornucopia!** 🌽`;
		let airdrop_array = [];
		let airdrop_items = [];
		let corn_items = [];

		function weighted_random(options) {
			let i;
		
			let weights = [];
		
			for (i = 0; i < options.length; i++) {
				weights[i] = options[i].weight + (weights[i - 1] || 0);
			}
			
			let random = Math.random() * weights[weights.length - 1];
			
			for (i = 0; i < weights.length; i++) {
				if (weights[i] > random) {
					break;
				}
			}

			return options[i].item;
		}

		const eventPicker = function() {

			if (db.tributes.get('Alive').length != 1) {

				tributeArray = db.tributes.keyArray();
				tributeArray = tributeArray.filter(key => key != 'Dead');
				tributeArray = tributeArray.filter(key => key != 'Alive');
				tributeArray = tributeArray.filter(key => db.tributes.get(key, 'status') === 'Alive');
				aliveArray = db.tributes.get('Alive');
				let typeArray = false;
				let tribute = [false, false]; //Tributes 1 and 2
				let gameStatus = db.stats.get('Game Status');
				let dayNum = db.stats.get('Day');
				let pickedEvent;
				let tribPostedName = [];

				if (gameStatus === 'Day') {
					intervalTime = 1.8e+6;
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
				intervalTime = 30000;

				if (!message_to_send.includes('Each contestant has the strength')) {
					message_to_send = 'Awaiting Event';
				}

				// Airdrops!
				if (gameStatus === 'Transition To Day' && tributeArray.length > 6) { //Airdrop time
					for (let i = 0; i < tributeArray.length; i++) {
						let rand_drop;
						if (airdrop_items.length != 0) {
							rand_drop = airdrop_items[Math.floor(Math.random() * airdrop_items.length)];
							db.priority_airdrop.delete(rand_drop);
						} else {
							rand_drop = corn_items[Math.floor(Math.random() * airdrop_items.length)];
							db.airdrop.delete(rand_drop);
						}

						airdrop_array.push(`<@${tributeArray[i]}> receives a ${rand_drop}`);
					}

					message_to_send = `(override) :sunny: Dawn of **Day ${dayNum}** :sunny:\n*${aliveArray.length} tributes remain.*\nThe daily airdrops begin to fall from the sky...\n\n:package: **Daily Airdrops** :package:
					\n${airdrop_array.join('\n')}`;

					gameStatus = 'Day';
					db.stats.set('Time', 'Day');
					db.stats.set('Game Status', 'Day');
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
						intervalTime = getTimeDif(new Date(), new Date(2021, 3, 20, 11, 0, 0, 0));

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
				}

				//Day/Night Switch
				if (tributeArray.length === 0) {
					if (gameStatus === 'Day') {
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
					} else if (gameStatus === 'Night') {
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

						intervalTime = 3.78e+7;

						gameStatus === 'Transition To Day';
					}
				}

				if (!message_to_send.includes('(override)')) {
				
					// Pick Tribute
					tribPostedName = [];
					tribute[0] = tributeArray[Math.floor(Math.random() * tributeArray.length)];
					console.log(`Tribute: ${interaction.guild.members.cache.get(tribute[0]).displayName}`);
					console.log(`Status: ${gameStatus}`);
					tribInv = db.tributes.get(tribute[0], 'inventory');

					if (db.backpack.get(tribute[0], 'no_ping') === true) {
						tribPostedName.push(`**${interaction.guild.members.cache.get(tribute[0]).displayName}**`);
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
							tribPostedName.push(`**${interaction.guild.members.cache.get(tribute[0]).displayName}**`);
						} else {
							tribPostedName.push(`<@${tribute[1]}>`);
						}

						pickedEvent = pickedEvent.replace('(Tribute 2)', tribPostedName[1]);
						console.log(`Tribute: ${interaction.guild.members.cache.get(tribute[1]).displayName}`);
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
								//remove_role(interaction, tribute[actTribNum], '771373653454880848'); //Remove alive role
								//add_role(interaction, tribute[actTribNum], '783437440786104382'); // Add dead role

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
									//remove_role(interaction, tribute[actTribNum], '771373653454880848'); //Remove alive role
									//add_role(interaction, tribute[actTribNum], '783437440786104382'); // Add dead role

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
				updateGameStatus(interaction);
				updateSponsorList(interaction);
				updateUserStatus(interaction);

				interaction.channel.send(message_to_send);
				setTimeout(eventPicker, intervalTime);
			} else {
				tributeArray = db.tributes.keyArray();
				tributeArray = tributeArray.filter(key => db.tributes.get(key, 'status') === 'Alive');
				tributeArray = tributeArray.filter(key => key != 'Dead');
				tributeArray = tributeArray.filter(key => key != 'Alive');

				interaction.channel.send(`𝔗𝔥𝔢 𝔚𝔦𝔫𝔫𝔢𝔯 𝔬𝔣 𝔱𝔥𝔢 𝕸𝖚𝖗𝖉𝖊𝖗 𝕽𝖔𝖞𝖆𝖑𝖊 𝔦𝔰 <@${tributeArray[0]}>!`);
			}

		};

		setTimeout(eventPicker, intervalTime);
	},
};