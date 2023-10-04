const { SlashCommandBuilder } = require("discord.js");
const cloudinary = require("cloudinary");
const { redClient } = require("../../redis");

cloudinary.v2.config({
  cloud_name: "testuser",
  api_key: "843265632781972",
  api_secret: "iQGhBkE2GyDvlQTNDeQrLG111BQ",
  secure: true,
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("upload")
    .setDescription("Store my file")
    .addAttachmentOption((option) =>
      option.setName("file").setDescription("File to upload")
    ),
  async execute(interaction) {
    const file = interaction.options.getAttachment("file");
    console.log({ file });

    if (!file) return;
    console.log({ interaction: interaction.user });
    const user = interaction.user;
    const { id, username } = user;

    try {
      const result = await cloudinary.v2.uploader.upload(`${file.attachment}`, {
        public_id: "discord-server",
      });
      console.log({ result });
      const res = await redClient.json.set(`file:${result.asset_id}`, '$', {
        "username": username,
        "id": id,
        "url": `${result.url}`,
        "bot": `bolda`
      })
      console.log({res})
    } catch (error) {
      console.error(error);
    }

    await interaction.reply(`Your file ${file.attachment}`);
    // await interaction.guild.members.ban(target);
  },
};
