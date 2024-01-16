const db = require('../db.js');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletemsg')
        .setDescription('Remove a scheduled message.')
        .addStringOption(option =>
            option.setName('timestamp')
                .setDescription('Timestamp of the message')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, client, cronTasks) {
        let scheduledMsgs = db.global_bot.get('msg_timestamps');
        let delTimestamp = interaction.options.getString('timestamp');
        let targetMsg = false;
        let targetTask = false;
        for (let msg of scheduledMsgs) {
            if (msg.timestamp == undefined) msg.timestamp = '0';
            if (parseInt(msg.timestamp) == delTimestamp) {
                targetMsg = msg;
                break;
            }
        }

        for (let task of cronTasks) {
            if (parseInt(task.timestamp) == delTimestamp) {
                targetTask = task;
                break;
            }
        }

        if (targetMsg == false) return interaction.reply('Message not found!');
        await targetTask.task.stop();
        scheduledMsgs = scheduledMsgs.filter(v => v.timestamp !== delTimestamp);
        db.global_bot.set('msg_timestamps', scheduledMsgs);
        interaction.reply(`The following message has been deleted:\n\n${targetMsg.msg}`);
	},
};
