const db = require('../db.js');
const { add_role, weighted_random, capitalize } = require('../func.js');
const { crateChance, shopItemsPP } = require('../arrays.json');

module.exports = {
	name: 'buy',
    description: 'Buy an item from the shop!',
    options: [
        {
            name: 'item',
            type: 'STRING',
            description: 'The item that you would like to purchase.',
            required: true,
        },
    ],
    admin: false,
	execute(interaction, client) {
        const item_name = capitalize(interaction.options[0].value);
        let shop_type;
        if (shopItemsPP.includes(item_name)) {
            shop_type = 'pp';
        } else {
            shop_type = 'mm';
        }
        let item_obj;
        let balance;
        if (shop_type === 'pp') {
            balance = db.balances.get(interaction.user.id);
            item_obj = db.shop.get(item_name);
        } else {
            balance = db.mmbalances.get(interaction.user.id);
            item_obj = db.mmshop.get(item_name);
        }

        if (balance >= item_obj.cost) {
            balance -= item_obj.cost;
            if (shop_type === 'pp') {
                db.balances.set(interaction.user.id, balance);
            } else {
                db.mmbalances.set(interaction.user.id, balance);
            }
            
            const purchase_channel = interaction.guild.channels.cache.get('814788744573878312');

            if (item_name != 'Banana' && item_name != 'Vip' && item_name != 'Grape' && item_name != 'Crate' && 
            item_name != 'Bone' && item_name != 'Gold Crown') {
                purchase_channel.send(`<@145267507844874241>, <@${interaction.user.id}> has bought the ${item_obj.emoji} **${item_name}** ${item_obj.emoji} item!`);
            } else {
                purchase_channel.send(`<@${interaction.user.id}> has bought the ${item_obj.emoji} **${item_name}** ${item_obj.emoji} item.`);
                if (item_name === 'Banana') {

                    const bananaRole = client.guilds.cache.find(guild => guild.id === '771373425734320159').roles.cache.find(role => role.name === "🍌Banana");
                    interaction.guild.members.fetch(interaction.user).then(a => a.roles.add(bananaRole));

                } else if (item_name === 'Bone') {
                    add_role(interaction, interaction.user, '840782529824817163');
                } else if (item_name === 'Gold Crown') {
                    add_role(interaction, interaction.user, '839540200908390430');
                } else if (item_name === 'Crate') {
                    const cratePick = weighted_random(crateChance);

                    switch(cratePick) {
                        case 'pinapl': interaction.channel.send('<:botglad:773273503645696060> PINAPL CRATE <:botglad:773273503645696060>\n*React first to claim!*'); break;
                        case 'tricky': interaction.channel.send('<:botcat:776126782805377034> TRICKY CRATE <:botcat:776126782805377034>\n*React first to claim!*'); break;
                        case 'king': interaction.channel.send('<:botking:773959160110121031> KING CRATE <:botking:773959160110121031>\n*React first to claim!*'); break;
                    }
                }
            }
            if (item_name != 'Crate') {
                if (shop_type === 'pp') {
                    return interaction.editReply(`${item_name} has been purchased!\nIf this is an item that requires manual input from Pinapl, you will see its effect once he gets to it.\n\`New balance: ${balance}\`<:pp:772971222119612416>`);
                } else {
                    return interaction.editReply(`${item_name} has been purchased!\nIf this is an item that requires manual input from Pinapl, you will see its effect once he gets to it.\n\`New balance: ${balance}\`<:mm:839540228859625522>`);
                }
            } else {
                return interaction.editReply(`Crate purchased.`);
            }
        } else {
            if (shop_type === 'pp') {
                return interaction.editReply(`You don't have enough <:pp:772971222119612416> to buy this.\n\`Current balance: ${balance}\`<:pp:772971222119612416>`);
            } else {
                return interaction.editReply(`You don't have enough <:mm:839540228859625522> to buy this.\n\`Current balance: ${balance}\`<:mm:839540228859625522>`);
            }
        }
	},
};