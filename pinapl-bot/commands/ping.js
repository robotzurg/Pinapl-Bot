/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction, client) {
		await interaction.editReply('Pong!');
		/*const list = client.guilds.cache.get("771373425734320159");
		list.members.cache.each(member => {
			db.profile.set(member.user.id, [], 'items');
		});*/
	},
};