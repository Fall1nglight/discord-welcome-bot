const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { tiers } = require('../../utils/constans');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server-info')
    .setDescription('Displays information about the server'),

  async execute(interaction) {
    await interaction.deferReply();

    const {
      member: {
        guild,
        guild: { memberCount, id, name, premiumSubscriptionCount, premiumTier },
      },
    } = interaction;

    const roles = await guild.roles.fetch();
    const members = await guild.members.fetch();
    const owner = await guild.fetchOwner();
    const bots = members.filter((member) => member.user.bot);
    const onlineMembers = members.filter(
      (member) => member.presence?.status === 'online'
    );

    const serverInfoEmbed = new MessageEmbed()
      .setTitle('⚙️ Server Information')
      .addField(
        'Member count',
        `${memberCount - bots.size} ${memberCount > 1 ? 'users' : 'user'}, ${
          bots.size
        } ${bots.size > 1 ? 'bots' : 'bot'}`,
        true
      )
      .addField('Online users', `${onlineMembers.size}`, true)
      .addField('Number of roles', `${roles.size}`, true)
      .addField('Server boosters', `${premiumSubscriptionCount}`, true)
      .addField('Current boost level', tiers[premiumTier], true)
      .addField('Owner', `${owner}`, true)
      .setFooter({ text: `${name} | Id: ${id}` });

    await interaction.editReply({ embeds: [serverInfoEmbed] });
  },
};
