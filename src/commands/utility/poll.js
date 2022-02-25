const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Collection } = require('discord.js');

const { pollEmojis } = require('../../utils/emojiCharacters');

module.exports = {
  // use 'conf' obj
  path: __filename,
  // location ->

  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Creates a poll')
    .addStringOption((option) =>
      option.setName('string').setDescription('Poll question').setRequired(true)
    )
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
    // todo
    // optimize code
    // clear user messages
    // avoid using followUp()
    // correct try-catch
    // correct variable naming - done
    // prompt user the question
    // use embed with emojis
    // set default poll time to 30s
    // if (reason === 'time') {
    //   return message.error('misc:TIMES_UP');
    // }
    // ? graph

    const defaultPromptTime = 20000;
    const defaultPollTime = 10000;

    const { channel } = interaction;

    const question = interaction.options.getString('string');
    const numOfAnswers = interaction.options.getInteger('int');
    const pollTime =
      interaction.options.getInteger('timeout') || defaultPollTime;
    const currEmojis = pollEmojis.slice(0, numOfAnswers);
    const userFilter = (m) =>
      interaction.user.id === m.author.id && !m.author.bot;
    const reactionFilter = (reaction) =>
      currEmojis.includes(reaction.emoji.name);

    try {
      const firstReply = await interaction.reply(
        `Creating poll..\nNow you have ${
          defaultPollTime / 1000
        } seconds to submit your poll answers.\nPlease write each answer in different messages!`
      );

      const userMessages = await interaction.channel.awaitMessages({
        filter: userFilter,
        time: defaultPromptTime,
        max: numOfAnswers,
        errors: ['time'],
      });

      const pollEmbed = new MessageEmbed()
        .setTitle(question)
        .setColor('PURPLE');

      const messagesToDelete = [];
      const answers = new Map();

      Array.from(userMessages.values()).forEach((message, i) => {
        const emoji = pollEmojis[i];

        answers.set(emoji, message.content);
        pollEmbed.addField('\u200b', `${emoji} : ${message.content}`, false);
        messagesToDelete.push(message);
      });

      await channel.bulkDelete(messagesToDelete);
      await interaction.deleteReply();

      const pollMessage = await channel.send({ embeds: [pollEmbed] });
      const collector = pollMessage.createReactionCollector({
        filter: reactionFilter,
        time: pollTime,
      });

      currEmojis.forEach(async (emoji) => {
        await pollMessage.react(emoji);
      });

      const result = new Collection();

      collector.on('end', async (collected) => {
        for (const [emoji, reaction] of collected) {
          result.set(emoji, {
            answer: answers.get(emoji),
            receivedVotes: reaction.count,
          });
        }

        const votes = collected.map((reaction) => reaction.count);
        const max = Math.max(...votes);
        const winners = result.filter(
          ({ receivedVotes }) => receivedVotes === max && receivedVotes > 1
        );

        if (!winners.size)
          return channel.send('Nobody participated in the poll!');

        if (winners.size === numOfAnswers)
          return channel.send(
            `Every answer got the same amount of votes ${max}!`
          );

        if (winners.size >= 1) {
          const reply = Array.from(winners.values())
            .map(
              ({ answer, receivedVotes }) =>
                `${answer} - ${receivedVotes} votes`
            )
            .join('\n');

          await channel.send(
            `${winners.size > 1 ? 'Winners' : 'Winner'} of the vote\n${reply}`
          );
        }
      });
    } catch (error) {
      console.log({ error });
      await interaction.followUp('You did not enter any input!');
    }
  },
};
