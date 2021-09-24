const db = require('../db.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setprofile')
        .setDescription('For Pinapl, ignore this.')
        .addStringOption(option =>
            option.setName('new_value')
                .setDescription('The new value to enter')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user') 
                .setDescription('The user whos profile you\'d like to change.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('stat')
                .setDescription('The stat to change')
                .setRequired(true)
                .addChoices([
                    [
                        'games_played',
                        'games_played',
                    ], [
                        'games_won',
                        'games_won',
                    ], [
                        'kill_streak',
                        'kill_streak',
                    ], [
                        'kd_ratio',
                        'kd_ratio',
                    ], [
                        'kills',
                        'kills',
                    ], [
                        'games_list',
                        'games_list',
                    ],
                ])),
    admin: true,
	async execute(interaction) {
        if (interaction.user.id != '145267507844874241' && interaction.user.id != '122568101995872256') {
            return await interaction.editReply({ content: 'This command isn\'t for you.' });
        } else {
            const stat = interaction.options.getString('stat');
            let new_value = interaction.options.getString('new_value');
            const user = interaction.options.getUser('user');

            // Parse the new_value argument
            if (stat != 'games_list') {
                new_value = parseFloat(new_value);
            } else {
                new_value = new_value.split(' & ');
                for (let i = 0; i < new_value.length; i++) {
                    new_value[i] = parseFloat(new_value[i]);
                }
            }

            // Set the new_value argument into the profile of the user
            db.profile.set(user.id, new_value, `murder.${stat}`);
            interaction.editReply(`Set the ${stat} stat to ${new_value} for <@${user.id}>`);
        }
	},
};