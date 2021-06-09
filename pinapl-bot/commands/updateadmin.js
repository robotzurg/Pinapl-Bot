const { updateGameStatus, updateSponsorList, updateUserStatus } = require("../func");

module.exports = {
	name: 'updateadmin',
    description: 'Update\'s the admin panel.',
    options: [],
	admin: true,
	execute(interaction) {
        updateGameStatus(interaction);
        updateSponsorList(interaction);
        updateUserStatus(interaction);

        interaction.editReply('Successfully updated.');
	},
};