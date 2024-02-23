const { SlashCommandBuilder } = require('discord.js');
const db = require('../db.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sponsor')
		.setDescription('Sponsor an item for the games!')
		.addStringOption(option => 
			option.setName('item')
				.setDescription('The item you would like to sponsor.')
                .setRequired(true)),
	async execute(interaction) {
        let item = interaction.options.getString('item');
        item = item.replace('*', '\*');
        if (db.profile.get(interaction.user.id, 'sponsor_count') == undefined) {
            db.profile.set(interaction.user.id, 1, 'sponsor_count');
        } else {
            if (db.profile.get(interaction.user.id, 'sponsor_count') == 3) {
                return interaction.reply('You have hit your maximum of 3 sponsors for this time period. You can sponsor again at 10am MST.')
            } else {
                db.profile.math(interaction.user.id, '+', 1, 'sponsor_count');
            }
        }
        
        db.global_bot.push('sponsor_list', {item: item, user_id: interaction.user.id});

        const sponsorChannel = interaction.guild.channels.cache.get('1189793123329654824');
        sponsorChannel.send(`- **${item}** from <@${interaction.user.id}>`)
        interaction.reply(`The item **${item}** has been sponsored into the Murder Royale!`)
	},
};