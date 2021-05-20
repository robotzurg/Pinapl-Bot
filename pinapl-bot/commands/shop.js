const db = require('../db.js');
const Discord = require('discord.js');

module.exports = {
	name: 'shop',
    description: 'See whats in the shop!',
    options: [],
    admin: false,
	execute(interaction) {
        const shopItemArray = db.shop.keyArray();

        const shopEmbed = new Discord.MessageEmbed()
        .setColor('#ffff00')
        .setTitle(`Citrus Shop!`);
        for (let i = 0; i < shopItemArray.length; i++) {
            const i_name = shopItemArray[i];
            const i_cost = db.shop.get(shopItemArray[i], 'cost');
            const i_desc = db.shop.get(shopItemArray[i], 'desc');
            const i_emoji = db.shop.get(shopItemArray[i], 'emoji');
            shopEmbed.addField(`${i_emoji} ${i_name} ${i_emoji}`, `Description: **${i_desc}**\nPrice: **${i_cost}**`, true);
        }

        interaction.editReply(shopEmbed);
	},
};