const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("upload")
    .setDescription("Store my file")
    .addAttachmentOption((option) =>
      option.setName("file").setDescription("File to upload")
    ),
  async execute(interaction) {
    const file = interaction.options.getAttachment('file');
		console.log({file})

		if(!file) return

		await interaction.reply(`Your file ${file.attachment}`);
		// await interaction.guild.members.ban(target);
  },
};
