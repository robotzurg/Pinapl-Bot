const db = require('../db.js');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

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
                .addChoices(
                    { name: 'games_played', value: 'games_played' },
                    { name: 'games_won', value: 'games_won' },
                    { name: 'kill_streak', value: 'kill_streak' },
                    { name: 'kd_ratio', value: 'kd_ratio' },
                    { name: 'kills', value: 'kills' },
                    { name: 'games_list', value: 'games_list' },
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
        if (interaction.user.id != '145267507844874241' && interaction.user.id != '122568101995872256') {
            return await interaction.reply({ content: 'This command isn\'t for you.' });
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
            interaction.reply(`Set the ${stat} stat to ${new_value} for <@${user.id}>`);
        }
	},
};