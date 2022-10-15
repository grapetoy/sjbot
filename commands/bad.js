const { SlashCommandBuilder } = require('@discordjs/builders');
const { check, general, minor, sexual, belittle, race, parent, foreign, special, politics } = require('korcen')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('badword')
        .setDescription('욕설확인을 합니다')
        .addStringOption(option => option.setName('target').setDescription('나쁜 말').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getString('target');
        return interaction.reply({ content: `You wanted to kick: ${user.username}`, ephemeral: true });
    },
};