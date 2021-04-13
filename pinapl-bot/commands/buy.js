const db = require('../db.js');
const { capitalize } = require('../func.js');

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

            if (!message.content.includes('Banana') && !message.content.includes('VIP')) {
                purchase_channel.send(`<@145267507844874241>, <@${message.author.id}> has bought the ${item_obj.emoji} **${item_name}** ${item_obj.emoji} item!`);
            } else {
                purchase_channel.send(`<@${message.author.id}> has bought the ${item_obj.emoji} **${item_name}** ${item_obj.emoji} item.`);
                if (message.content.includes('Banana')) {

                    const bananaRole = message.client.guilds.cache.find(guild => guild.id === '771373425734320159').roles.cache.find(role => role.name === "🍌Banana");
                    message.guild.members.fetch(message.author).then(a => a.roles.add(bananaRole));

                } else if (message.content.includes('VIP')) {

                    const VIPRole = message.client.guilds.cache.find(guild => guild.id === '771373425734320159').roles.cache.find(role => role.name === "🍐VIP");
                    message.guild.members.fetch(message.author).then(a => a.roles.add(VIPRole));

                }
            }
            return message.channel.send(`${item_name} has been purchased!\nIf this is an item that requires manual input from Pinapl, you will see its effect once he gets to it.\n\`New balance: ${balance}\`<:pp:772971222119612416>`);
        } else {
            return message.channel.send(`You don't have enough <:pp:772971222119612416> to buy this.\n\`Current balance: ${balance}\`<:pp:772971222119612416>`);
        }
	},
};