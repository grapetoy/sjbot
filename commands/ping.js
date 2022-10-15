const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.deferReply({ephemeral:true});
        setTimeout(
            function () {
                interaction.followUp({
                    content: `클라이언트 핑 : ${interaction.client.ws.ping}ms\n디스코드 게이트웨이 핑 : ${Date.now() - interaction.createdTimestamp}ms\n:new:사장봇 버전 1.2.4`
                })
            }
        )
	},
};
