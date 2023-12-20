const db = require('../db.js');
const { add_role, weighted_random, capitalize } = require('../func.js');
const { crateChance, shopItemsPP } = require('../arrays.json');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy an item from the shop!')
		.addStringOption(option => 
			option.setName('item')
				.setDescription('The item that you would like to purchase.')
				.setRequired(true)),
	execute(interaction, client) {
        const item_name = capitalize(interaction.options.getString('item'));
        let shop_type;
        if (shopItemsPP.includes(item_name)) {
            shop_type = 'pp';
        } else {
            shop_type = 'mm';
        }

        let item_obj;
        let balance;
        console.log(item_name);
        console.log(db.shop.keyArray());

        if (shop_type === 'pp') {
            balance = db.balances.get(interaction.user.id);
            item_obj = db.shop.get(item_name);
            console.log(item_obj);
        } else {
            balance = db.mmbalances.get(interaction.user.id);
            item_obj = db.mmshop.get(item_name);
        }

        if (balance >= item_obj.cost) {

            db.profile.math(interaction.user.id, '+', 1, 'casino.items_bought');

            balance -= item_obj.cost;
            if (shop_type === 'pp') {
                db.balances.set(interaction.user.id, balance);
            } else {
                db.mmbalances.set(interaction.user.id, balance);
            }
            
            const purchase_channel = interaction.guild.channels.cache.get('814788744573878312');

            if (item_name != 'Banana' && item_name != 'Vip' && item_name != 'Grape' && item_name != 'Crate' && item_name != 'Gold Crown' && item_name != 'Ping' && item_name != 'Clover') {
                purchase_channel.send(`<@145267507844874241>, <@${interaction.user.id}> has bought the ${item_obj.emoji} **${item_name}** ${item_obj.emoji} item!`);
            } else {
                purchase_channel.send(`<@${interaction.user.id}> has bought the ${item_obj.emoji} **${item_name}** ${item_obj.emoji} item.`);
                if (item_name === 'Banana') {

                    const bananaRole = client.guilds.cache.find(guild => guild.id === '771373425734320159').roles.cache.find(role => role.name === "🍌Banana Role");
                    interaction.guild.members.fetch(interaction.user).then(a => a.roles.add(bananaRole));

                    if (db.profile.get(interaction.user.id, 'items') != 'banana') {
                        db.profile.push(interaction.user.id, 'banana', `items`);
                    } else {
                        db.balances.math(interaction.user.id, '+', 500);
                        purchase_channel.send(`It failed due to them already owning it.`);
                        db.profile.math(interaction.user.id, '-', 1, 'casino.items_bought');
                        return interaction.reply('You already own the Banana, so you can\'t get it again!');
                    }

                } else if (item_name === 'Gold Crown') {
                    add_role(interaction, interaction.user, '839540200908390430');
                    if (db.profile.get(interaction.user.id, 'items') != 'crown') {
                        db.profile.push(interaction.user.id, 'crown', `items`);
                    } else {
                        db.balances.math(interaction.user.id, '+', 10000);
                        purchase_channel.send(`It failed due to them already owning it.`);
                        db.profile.math(interaction.user.id, '-', 1, 'casino.items_bought');
                        return interaction.reply('You already own the Gold Crown, so you can\'t get it again!');
                    }
                } else if (item_name === 'Crate') {
                    const cratePick = weighted_random(crateChance);

                    switch(cratePick) {
                        case 'pinapl': interaction.channel.send('<:botglad:773273503645696060> PINAPL CRATE <:botglad:773273503645696060>\n*React first to claim!*'); break;
                        case 'tricky': interaction.channel.send('<:botcat:776126782805377034> TRICKY CRATE <:botcat:776126782805377034>\n*React first to claim!*'); break;
                        case 'king': interaction.channel.send('<:botking:773959160110121031> KING CRATE <:botking:773959160110121031>\n*React first to claim!*'); break;
                    }
                } else if (item_name === 'Ping') {
                    let channel_to_send = interaction.guild.channels.cache.get('771373426664275980');
                    channel_to_send.send(`Get pinged loser <@145267507844874241>\n*from ${interaction.member.displayName}, who purchased the Ping item.*`);
                } else if (item_name === 'Clover') {
                    if (db.profile.get(interaction.user.id, 'items') != 'clover') {
                        db.profile.push(interaction.user.id, 'clover', `items`);
                    } else {
                        db.balances.math(interaction.user.id, '+', 5000);
                        purchase_channel.send(`It failed due to them already owning it.`);
                        db.profile.math(interaction.user.id, '-', 1, 'casino.items_bought');
                        return interaction.reply('You already own the clover, so you can\'t get it again!');
                    }
                }
            }
            if (item_name != 'Crate') {
                if (shop_type === 'pp') {
                    return interaction.reply(`${item_name} has been purchased!\n\`New balance: ${balance}\`<:pp:772971222119612416>`);
                } else {
                    return interaction.reply(`${item_name} has been purchased!\n\`New balance: ${balance}\`<:mm:839540228859625522>`);
                }
            } else {
                return interaction.reply(`Crate purchased.`);
            }
        } else {
            if (shop_type === 'pp') {
                return interaction.reply(`You don't have enough <:pp:772971222119612416> to buy this.\n\`Current balance: ${balance}\`<:pp:772971222119612416>`);
            } else {
                return interaction.reply(`You don't have enough <:mm:839540228859625522> to buy this.\n\`Current balance: ${balance}\`<:mm:839540228859625522>`);
            }
        }
	},
};
