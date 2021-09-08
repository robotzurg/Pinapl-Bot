const db = require('../db.js');
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('See whats in the shop!')
        .addSubcommand(subcommand => subcommand.setName('pp').setDescription('PP shop'))
        .addSubcommand(subcommand => subcommand.setName('mm').setDescription('MM shop')),
    admin: false,
	execute(interaction) {
        const shopType = interaction.options._subcommand;
        console.log(shopType);
        let shopItemArray;

        if (shopType === 'pp') {
           shopItemArray = db.shop.keyArray();
        } else {
            shopItemArray = db.mmshop.keyArray();
        }

        const shopEmbed = new Discord.MessageEmbed()
        .setColor('#ffff00')
        .setTitle(`${shopType === 'pp' ? '<:pp:772971222119612416> Pinapl Points Shop! <:pp:772971222119612416>' : '<:mm:839540228859625522> Murder Money Shop! <:mm:839540228859625522>'}`);
        if (shopType === 'pp') {
            for (let i = 0; i < shopItemArray.length; i++) {
                const i_name = shopItemArray[i];
                const i_cost = db.shop.get(shopItemArray[i], 'cost');
                const i_desc = db.shop.get(shopItemArray[i], 'desc');
                const i_emoji = db.shop.get(shopItemArray[i], 'emoji');
                shopEmbed.addField(`${i_emoji} ${i_name} ${i_emoji}`, `Description: **${i_desc}**\nPrice: **${i_cost}**`, true);
            }
        } else {
            for (let i = 0; i < shopItemArray.length; i++) {
                const i_name = shopItemArray[i];
                const i_cost = db.mmshop.get(shopItemArray[i], 'cost');
                const i_desc = db.mmshop.get(shopItemArray[i], 'desc');
                const i_emoji = db.mmshop.get(shopItemArray[i], 'emoji');
                shopEmbed.addField(`${i_emoji} ${i_name} ${i_emoji}`, `Description: **${i_desc}**\nPrice: **${i_cost}**`, true);
            }
        }
        

        interaction.editReply({ embeds: [shopEmbed] });
	},
};