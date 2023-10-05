const {
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const cloudinary = require("cloudinary");
const prisma = require("../../lib/prisma");

cloudinary.v2.config({
  cloud_name: "testuser",
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const buyWithFlow = new ButtonBuilder()
  .setLabel("Buy with Flow")
  .setStyle(ButtonStyle.Link);

const row = new ActionRowBuilder().addComponents(buyWithFlow);

const exampleEmbed = new EmbedBuilder()
  .setColor(0x7289da)
  .setURL("http://localhost:3000")
  .addFields({
    name: "Inline field title",
    value: "Some value here",
    inline: true,
  })
  .setTimestamp();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("upload")
    .setDescription("Store my file")
    .addAttachmentOption((option) =>
      option.setName("file").setDescription("File to upload")
    ),
  async execute(interaction) {
    const uploadedFile = interaction.options.getAttachment("file");
    const avatar = interaction.user.displayAvatarURL();

    if (!uploadedFile) return;

    const user = interaction.user;
    const { id, username } = user;
    await interaction.deferReply();
    const result = await cloudinary.v2.uploader.upload(
      `${uploadedFile.attachment}`,
      {
        public_id: "discord-server",
      }
    );
    console.log({ result });
    const savedFile = await prisma.file.create({
      data: {
        username,
        ownerId: id,
        url: result.url,
        fileId: uploadedFile.id,
        avatar,
        description: "nft"
      },
    });
    buyWithFlow.setURL(`http://localhost:3001?nftId=${uploadedFile.id}`);
    // console.log({ savedFile });
    // await interaction.editReply({
    //   content: `Your file ${uploadedFile}`,
    //   components: [row],
    // });

    exampleEmbed
      .setAuthor({
        name: `${username}`,
        iconURL: `${avatar}`,
        url: `${avatar}`,
      })
      .setTitle(`NFT Cheerios`)
      .setImage(`${savedFile.url}`)
      .setThumbnail(`${avatar}`)
      .setDescription("The Topmost NFT");

    await interaction.channel.send({
      embeds: [exampleEmbed],
      components: [row],
    });
    // await interaction.guild.members.ban(target);
  },
};
