const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, inlineCode,ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const axios = require('axios');
let dgr = undefined
let dgrNum = undefined
let emoji = undefined
module.exports = {
    data: new SlashCommandBuilder()
        .setName('hangang')
        .setDescription('한강 물 온도 체크'),
    async execute(interaction) {
        axios.get("https://hangang.ivlis.kr/aapi.php?type=dgr")
            .then(function(response) {
            dgr = String(response.data); // dgr은 단위 포함 (17℃)
            let regex = /[^0-9]/g;
            dgrNum = parseInt(dgr.replace(regex, "")); // dgr은 정수형 (17)
            if (dgrNum <= 0) { //영하
                emoji = ":snowflake:" // ❄️
            } else if(dgrNum>=27) {
                emoji = ":thermometer:" // 🌡️
            } else if (dgrNum > 0 && dgrNum<15) {
                emoji = "cold_face" // 🥶
            } else {
                emoji = ":person_playing_water_polo:" // 🤽
            }
        axios.get("https://hangang.ivlis.kr/aapi.php?type=time")
        .then(function(response){
            let time = String(response.data);
            const resultEmbed = new EmbedBuilder()
            .setTitle(`${emoji} 한강 수온`)
            .setColor("Blue")
            .setDescription(`${dgr}\n${time}`)
            .setFooter({text:'장난으로만 봐주세요 • 자살예방상담전화 1393'})
            interaction.reply({ embeds : [resultEmbed] })
        })
        })
    },
};