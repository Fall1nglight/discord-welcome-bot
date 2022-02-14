const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { format } = require('date-fns');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('member-info')
    .setDescription('Display info about @member')
    .addUserOption((option) =>
      option.setName('target').setDescription('Specify @member')
    ),

  async execute(interaction) {
    const target = interaction.options.getMember('target');
    const user = target?.user || interaction.user;
    const member = target || interaction.member;

    const { username, id: userId } = user;
    const { joinedTimestamp: joinedAt, _roles: memberRoleIds, guild } = member;

    const avatarUrl = user.avatarURL();
    const roles = await guild.roles.fetch();
    const filteredRoles = roles.filter((role) =>
      memberRoleIds.includes(role.id)
    );

    const memberRoles = filteredRoles.size
      ? [...filteredRoles.values()]
      : 'User has no roles';

    const status = member.presence?.status || 'offline';
    const date = format(new Date(joinedAt), 'PP');

    const memberInfoEmbed = new MessageEmbed()
      .setTitle('🕺 Member Information')
      .addField('Username', username, true)
      .addField('Joined', date, true)
      .addField('Status', status, true)
      .addField('User Id', `${userId}`, true)
      .addField('Roles', `${memberRoles}`, true)
      .setImage(avatarUrl);

    await interaction.reply({ embeds: [memberInfoEmbed] });
  },
};
