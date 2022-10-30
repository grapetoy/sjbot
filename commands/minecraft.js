const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, inlineCode } = require('discord.js');
const util = require('minecraft-server-util');

const options = {
    timeout: 1000 * 2,
    enableSRV: true
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minecraft')
        .setDescription('겜플럼티 마크 서버상태를 조회합니다'),
    async execute(interaction) {
        util.status('studykim.myds.me', 25565, options)
            .then(function(result){
                const resultEmbed = new EmbedBuilder()
                .setTitle('<:grass_block:1036153605092294666>겜플럼티 마크 서버 정보')
                .setColor('Green')
                .setDescription(result.motd.clean)
                .setThumbnail(result.favicon)
                .setFields(
                    {name:':1234:버전',value:'<:java:1036154851819790377>자바 에디션 1.19.2'},
                    {name:':busts_in_silhouette:플레이어 수',value:`${String(result.players.online)}명/${String(result.players.max)}명`},
                    {name:':ping_pong:핑',value:`${result.roundTripLatency}ms`}
                )
                .setTimestamp()
                .setFooter(icon_url='https://cdn.discordapp.com/icons/856798983173963776/a79af2ab5393aabc52978e401340449c.webp?size=128',text='studykim.myds.me:25565')
                interaction.reply({ embeds:[resultEmbed] })
            })
            .catch(function(error){
                const errorEmbed = new EmbedBuilder()
                .setTitle('<:grass_block:1036153605092294666>겜플럼티 마크 서버 정보')
                .setColor('Red')
                .setDescription('서버가 오프라인입니다')
                .setTimestamp()
                .setFooter(icon_url='https://cdn.discordapp.com/icons/856798983173963776/a79af2ab5393aabc52978e401340449c.webp?size=128',text='studykim.myds.me:25565')
                interaction.reply({ embeds:[errorEmbed] })
            })
    },
};