const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const { ChannelType } = require('discord-api-types/v10');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ezembed')
        .setDescription('쉬운(EZ)한 버전의 /embed')
        .addChannelOption(option => option.setName('channel').setDescription('보내기를 원하는 채널을 선택하세요').setRequired(true).addChannelTypes(ChannelType.GuildText))
        .addStringOption(
            option => option.setName('color')
                .setDescription('색깔')
                .setRequired(true)
                .addChoices(
                    { name: "기본 default", value: "DEFAULF" },
                    { name: "하양 white", value: "WHITE" }
                )
        )

        .addStringOption(option => option.setName('title').setDescription('말그대로 제목을 적어주세요').setRequired(true))
        .addStringOption(option => option.setName('content').setDescription('내용').setRequired(true))
        .addMentionableOption(option => option.setName('mention').setDescription('멘션').setRequired(false)),
    async execute(interaction) {
        const ch = interaction.options.getChannel('channel');
        const title = interaction.options.getString('title')
        const description = interaction.options.getString('content');
        const color = interaction.options.getString('color')
        try {
            const embed = new MessageEmbed()
                .setColor(color)
                .setTitle(title)
                .setDescription(description);
            ch.send({ embeds: embed })
            interaction.reply({ content: "보내기 성공!" })
        }
        catch (error) {
            console.log(error)
            interaction.reply(`오류 발생!\n${error}`, ephemeral = true)
        }
    },
};