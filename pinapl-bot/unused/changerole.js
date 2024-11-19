const db = require('../db.js');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { add_role, remove_role, dateToCron } = require('../func.js');
const cron = require("node-cron");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changerole')
        .setDescription('Change a users role on a schedule.')
        .addSubcommand(subcommand => 
            subcommand.setName('add')
            .setDescription('Adds a role.')
            .addUserOption(option => 
                option.setName('user')
                    .setDescription('The user whose role will be changed.')
                    .setRequired(true))
            .addRoleOption(option =>
                option.setName('role')
                    .setDescription('The role being affected')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('timestamp')
                    .setDescription('Unix timestamp of when to affect the role (by default instant)')
                    .setRequired(false)))

        .addSubcommand(subcommand => 
            subcommand.setName('remove')
            .setDescription('Removes a role.')
            .addUserOption(option => 
                option.setName('user')
                    .setDescription('The user whose role will be changed.')
                    .setRequired(true))
            .addRoleOption(option =>
                option.setName('role')
                    .setDescription('The role being affected')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('timestamp')
                    .setDescription('Unix timestamp of when to affect the role (by default instant)')
                    .setRequired(false)))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, client) {
        let taggedUser = interaction.options.getUser('user');
        let role = interaction.options.getRole('role');
        let timestamp = interaction.options.getString('timestamp');
        let remove = interaction.options.getSubcommand();
        remove = (remove == 'remove');

        if (timestamp == null) {
            if (remove == false) {
                add_role(interaction.guild, taggedUser.id, role.id);
                interaction.reply(`The role **${role.name}** has been added to <@${taggedUser.id}>`);
            } else {
                remove_role(interaction.guild, taggedUser.id, role.id);
                interaction.reply(`The role **${role.name}** has been removed from <@${taggedUser.id}>`)
            }
        } else {
            if (timestamp.includes('<')) {
                timestamp = timestamp.substring(3, timestamp.length);
                timestamp = timestamp.substring(0, timestamp.length - 3);
            }
            timestamp = parseInt(timestamp);
            let date = new Date(timestamp * 1000);
            const currentDate = new Date();
            //if (!Date.parse(date)) return interaction.reply(`${timestamp} is not a valid date timestamp, please try again.`);
            //if (date < currentDate) return interaction.reply(`${timestamp} is in the past, and thus cannot be used to schedule. Please try again.`)
            let scheduleTime = dateToCron(date);

            let roleData = {
                user: taggedUser.id,
                role: role.id,
                role_name: role.name,
                time: scheduleTime,
                remove: remove,
            }

            db.global_bot.push('role_timestamps', roleData);

            cron.schedule(scheduleTime, () => { 
                let channelToSend = client.channels.cache.get('814788744573878312');
                if (remove == false) {
                    add_role(interaction.guild, taggedUser.id, role.id)
                    channelToSend.send(`The role **${role.name}** has been added to <@${taggedUser.id}> as per a scheduled role change.`);
                } else {
                    remove_role(interaction.guild, taggedUser.id, role.id);
                    channelToSend.send(`The role **${role.name}** has been removed from <@${taggedUser.id}> as per a scheduled role change.`);
                }

                let timestamps = db.global_bot.get('role_timestamps');
                timestamps = timestamps.filter(v => v.role != role.id || v.user != taggedUser.id || v.time != scheduleTime);
                console.log(timestamps);
                db.global_bot.set('role_timestamps', timestamps);
            }, {
                scheduled: true,
            });	

            interaction.reply(`The role change for <@${taggedUser.id}> at <t:${timestamp}:F> has been scheduled!`);
        }
	},
};
