const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const { ChannelType } = require('discord-api-types/v10');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('원하는 채널에 임베드를 보냅니다!')
        .addChannelOption(option => option.setName('channel').setDescription('보내기를 원하는 채널을 선택하세요').setRequired(true).addChannelTypes(ChannelType.GuildText))
        .addStringOption(option => option.setName('json').setDescription('원하는 Embed 메세지를 JSON문법으로 작성해주세요! JSON문법을 모른다면 /ezembed를 사용해주세요!').setRequired(true)),
    async execute(interaction) {
        const ch = interaction.options.getChannel('channel');
        const msg = interaction.options.getString('json')
        const json = JSON.parse(msg)
        const embed = new EmbedBuilder(json)
        try {
            ch.send({
                embeds: [embed]
            })
        }
        catch (error) {
            console.log(error)
            interaction.reply(`오류 발생!\n${error}`)
        }
        interaction.reply({ content: "보내기 성공!", ephemeral: true })
    },
};