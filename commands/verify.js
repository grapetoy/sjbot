const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('인증'),
    async execute(interaction) {
        return i = interaction.deferReply({ ephemeral: true })
    },
};