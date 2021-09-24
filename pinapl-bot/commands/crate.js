const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('crate')
		.setDescription('Spawn a crate [ADMIN ONLY]')
        .addStringOption(option => 
			option.setName('crate')
				.setDescription('What crate to spawn.')
                .setRequired(true)
                .addChoices([
					[
						'Pinapl Crate',
						'pinapl',
					], [
						'Tricky Crate',
						'tricky',
					], [
						'King Crate',
						'king',
					],
				])),
	admin: true,
	execute(interaction) {
        const cratePick = interaction.options.getString('crate');

        switch(cratePick) {
            case 'pinapl': interaction.channel.send('<:botglad:773273503645696060> PINAPL CRATE <:botglad:773273503645696060>\n*React first to claim!*'); break;
            case 'tricky': interaction.channel.send('<:botcat:776126782805377034> TRICKY CRATE <:botcat:776126782805377034>\n*React first to claim!*'); break;
            case 'king': interaction.channel.send('<:botking:773959160110121031> KING CRATE <:botking:773959160110121031>\n*React first to claim!*'); break;
        }

		interaction.deleteReply();
	},
};
