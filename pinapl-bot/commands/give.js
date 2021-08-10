const db = require('../db.js');

module.exports = {
	name: 'give',
    description: 'Give some of your pp to another user!',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user you would like to send money to.',
            required: true,
        }, {
            name: 'amount_of_pp',
            type: 'INTEGER',
            description: 'The amount of pp to send.',
            required: true,
        },
    ],
    admin: false,
	async execute(interaction) {
        const taggedUser = await interaction.guild.members.fetch(interaction.options._hoistedOptions[0].value);
        if (taggedUser === interaction.user) return interaction.editReply('You can\'t send <:pp:772971222119612416> to yourself.');
        const send_amt = interaction.options._hoistedOptions[1].value;

        let authorBal = db.balances.get(interaction.user.id);
        if (authorBal < send_amt) return interaction.editReply(`You don't have this much <:pp:772971222119612416>!\nCurrent balance: ${authorBal}`);
        let taggedUserBal = db.balances.get(taggedUser.id);

        authorBal -= send_amt;
        taggedUserBal += send_amt;

        db.balances.set(interaction.user.id, authorBal);
        db.balances.set(taggedUser.id, taggedUserBal);

        interaction.editReply(`Sent ${send_amt} <:pp:772971222119612416> to <@${taggedUser.id}>.`);
	},
};