const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('thinking')
        .setDescription('생각의자'),
    async execute(interaction) {
        return i = interaction.deferReply({ephemeral:true})
    },
};