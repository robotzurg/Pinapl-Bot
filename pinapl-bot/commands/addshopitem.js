const db = require('../db.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addshopitem')
		.setDescription('Add a new item to the shop.')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('The name of the item.')
                .setRequired(true))
		.addIntegerOption(option => 
			option.setName('cost')
				.setDescription('The cost of the item.')
				.setRequired(true))
        .addStringOption(option => 
            option.setName('description')
                .setDescription('The type of shop to add the item to.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('emoji')
                .setDescription('Emoji attached to the item.')
                .setRequired(true))
		.addStringOption(option => 
			option.setName('shop')
				.setDescription('The type of shop to add to.')
				.setRequired(true)
                .addChoices([
					[
						'Pinapl Points',
						'pp',
					], [
						'Murder Money',
						'mm',
					],
				])),
    admin: true,
	execute(interaction) {

        if (interaction.user.id === '122568101995872256' || interaction.user.id === '145267507844874241') {

            const item_name = interaction.options._hoistedOptions[0].value;
            const cost = interaction.options._hoistedOptions[1].value;
            const desc = interaction.options._hoistedOptions[2].value;
            const emoji = interaction.options._hoistedOptions[3].value;
            const shop_type = interaction.options._hoistedOptions[4].value;

            if (shop_type === 'pp') {
                db.shop.set(item_name, {
                    cost: cost,
                    desc: desc,
                    emoji: emoji, 
                });
            } else {
                db.mmshop.set(item_name, {
                    cost: cost,
                    desc: desc,
                    emoji: emoji, 
                });
            }

            interaction.editReply(`Added ${item_name} to the shop.`);
        } else {
            interaction.editReply(`This command isn't for you!`);
        }
	},
};