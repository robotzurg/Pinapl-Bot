const db = require('../db.js');
const { capitalize, add_role, weighted_random } = require('../func.js');
const { crateChance } = require('../arrays.json');

module.exports = {
	name: 'buy',
	type: 'Shop',
    description: 'Buy an item from the shop!',
	args: true,
	usage: `<name>`,
	execute(message, args) {
        args[0] = capitalize(args[0]);
        const item_name = args[0];
        const item_obj = db.shop.get(item_name);
        if (item_obj === undefined) return message.channel.send('Invalid item! Use `!shop` to view the items in the shop.');
        let balance = db.balances.get(message.author.id);

        if (balance >= item_obj.cost) {
            balance -= item_obj.cost;
            db.balances.set(message.author.id, balance);
            const purchase_channel = message.guild.channels.cache.get('814788744573878312');

            if (!message.content.toLowerCase().includes('banana') && !message.content.toLowerCase().includes('vip') &&
                !message.content.toLowerCase().includes('grape') && !message.content.toLowerCase().includes('crate') &&
                !message.content.toLowerCase().includes('bone') && !message.content.toLowerCase().includes('gold crown')) {
                purchase_channel.send(`<@145267507844874241>, <@${message.author.id}> has bought the ${item_obj.emoji} **${item_name}** ${item_obj.emoji} item!`);
            } else {
                purchase_channel.send(`<@${message.author.id}> has bought the ${item_obj.emoji} **${item_name}** ${item_obj.emoji} item.`);
                if (message.content.toLowerCase().includes('banana')) {

                    const bananaRole = message.client.guilds.cache.find(guild => guild.id === '771373425734320159').roles.cache.find(role => role.name === "🍌Banana");
                    message.guild.members.fetch(message.author).then(a => a.roles.add(bananaRole));

                } else if (message.content.toLowerCase().includes('bone')) {
                    add_role(message, message.author, '840782529824817163');
                } else if (message.content.toLowerCase().includes('gold crown')) {
                    add_role(message, message.author, '839540200908390430');
                } else if (message.content.toLowerCase().includes('crate')) {
                    const cratePick = weighted_random(crateChance);

                    switch(cratePick) {
                        case 'pinapl': message.channel.send('<:botglad:773273503645696060> PINAPL CRATE <:botglad:773273503645696060>\n*React first to claim!*'); break;
                        case 'tricky': message.channel.send('<:botcat:776126782805377034> TRICKY CRATE <:botcat:776126782805377034>\n*React first to claim!*'); break;
                        case 'king': message.channel.send('<:botking:773959160110121031> KING CRATE <:botking:773959160110121031>\n*React first to claim!*'); break;
                    }
                }
            }
            if (item_name.toLowerCase() != 'crate') {
                return message.channel.send(`${item_name} has been purchased!\nIf this is an item that requires manual input from Pinapl, you will see its effect once he gets to it.\n\`New balance: ${balance}\`<:pp:772971222119612416>`);
            }
        } else {
            return message.channel.send(`You don't have enough <:pp:772971222119612416> to buy this.\n\`Current balance: ${balance}\`<:pp:772971222119612416>`);
        }
	},
};