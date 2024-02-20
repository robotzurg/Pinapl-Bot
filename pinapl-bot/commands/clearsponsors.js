const db = require('../db.js');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clearsponsors')
		.setDescription('Clear out the sponsor list.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		if (interaction.user.id === '122568101995872256' || interaction.user.id === '145267507844874241') {
            db.global_bot.set('sponsor_list', []);
            interaction.reply('Cleared sponsor list.');
            const sponsorChannel = interaction.guild.channels.cache.get('1208489328108376084');
            for (let i = 0; i < 5; i++) {
                // Delete 500 messages;
                await sponsorChannel.bulkDelete(100);
            }
            await console.log('Cleared.');
		} else {
			interaction.reply(`This command isn't for you!`);
		}
	},
};
		