const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { pollEmojis } = require('../../utils/emojiCharacters');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Creates a poll')
    .addIntegerOption((option) =>
      option
        .setName('int')
        .setDescription('Number of answers')
        .setMinValue(2)
        .setMaxValue(10)
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('timeout')
        .setDescription('Poll time')
        .setMinValue(15)
        .setMaxValue(300)
    ),

  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.reply('Please write the answers in different messages');

    let counter = 0;
    const currEmojis = [];
    const numOfAnswers = interaction.options.getInteger('int');
    const pollTime = interaction.options.getInteger('timeout') || 10000;
    const userFilter = (m) => interaction.user.id === m.author.id;
    const reactionFilter = (reaction) =>
      currEmojis.includes(reaction.emoji.name);

    try {
      const messages = await interaction.channel.awaitMessages({
        filte: userFilter,
        time: 20000,
        max: numOfAnswers,
        errors: ['time'],
      });

      const answers = messages
        .map((message) => {
          counter++;
          return `${pollEmojis[counter]} - ${message.content}`;
        })
        .join('\n');

      const pollMessage = await interaction.followUp(answers);

      console.log('Start colelcting messages..');
      const collector = pollMessage.createReactionCollector({
        filter: reactionFilter,
        time: pollTime,
      });

      console.log('Reacting to poll..');
      for (let i = 1; i <= numOfAnswers; i++) {
        await pollMessage.react(`${pollEmojis[i]}`);
        currEmojis.push(pollEmojis[i]);
      }

      // todo
      // ? use createRectionCollector or awaitReactions
      // if we use awaitReactions, we need to warn users
      // to wait untel the bot is finished with the initial
      // reaction
      let pollResult;
      collector.on('end', (collected) => {
        pollResult = collected.filter((reaction) => reaction.count > 1);
      });

      console.log({ pollResult });

      // ? how to display results

      // let result = '';
      // currEmojis.forEach((emoji) => {
      //   console.log(`Searching for ${emoji}`);
      //   console.log(pollResult.get(emoji));
      // });
    } catch (error) {
      console.log(error);
      await interaction.followUp('You did not enter any input!');
    }
  },
};
