const db = require('../db.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Give some of your pp to another user.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user you would like to send money to.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount_of_pp')
                .setDescription('The amount of pp to send')
                .setRequired(true)),
	async execute(interaction) {
        const taggedUser = await interaction.guild.members.fetch(interaction.options.getUser('user').id);
        if (taggedUser === interaction.user || interaction.options.getUser('user').id === interaction.user.id) return interaction.reply('You can\'t send <:pp:772971222119612416> to yourself.');
        const send_amt = interaction.options.getInteger('amount_of_pp')

        let authorBal = db.balances.get(interaction.user.id);
        if (authorBal < send_amt) return interaction.reply(`You don't have this much <:pp:772971222119612416>!\nCurrent balance: ${authorBal}`);
        if (send_amt <= 0) return interaction.reply(`You can't send negative money.`);
        let taggedUserBal = db.balances.get(taggedUser.id);

        authorBal -= send_amt;
        taggedUserBal += send_amt;

        db.balances.set(interaction.user.id, authorBal);
        db.balances.set(taggedUser.id, taggedUserBal);

        interaction.reply(`Sent ${send_amt} <:pp:772971222119612416> to <@${taggedUser.id}>.`);
	},
};
