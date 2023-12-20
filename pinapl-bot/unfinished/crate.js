const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('crate')
		.setDescription('Spawn a crate [ADMIN ONLY]')
        .addStringOption(option => 
			option.setName('crate')
				.setDescription('What crate to spawn.')
                .setRequired(true)
				.addChoices(
					{ name: 'Pinal Crate', value: 'pinapl' },
					{ name: 'Tricky Crate', value: 'tricky' },
					{ name: 'King Crate', value: 'king' },
				))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	execute(interaction) {
        const cratePick = interaction.options.getString('crate');

        switch(cratePick) {
            case 'pinapl': interaction.channel.send('<:botglad:916344650405642292> PINAPL CRATE <:botglad:916344650405642292>\n*React first to claim!*'); break;
            case 'tricky': interaction.channel.send('<:botcatbox:791088071802224710> TRICKY CRATE <:botcatbox:791088071802224710>\n*React first to claim!*'); break;
            case 'king': interaction.channel.send(':crown: KING CRATE :crown:\n*React first to claim!*'); break;
        }

		interaction.deleteReply();
	},
};
