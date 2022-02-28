/* eslint-disable no-await-in-loop */
const fs = require('fs/promises');
const path = require('path');

const TIERS = {
  NONE: 'Guild has not unlocked any Server Boost perks',
  TIER_1: 'Guild has unlocked Server Boost level 1 perks',
  TIER_2: 'Guild has unlocked Server Boost level 2 perks',
  TIER_3: 'Guild has unlocked Server Boost level 3 perks',
};

const COLORS = {
  DEFAULT: 'DEFAULT',
  WHITE: 'WHITE',
  AQUA: 'AQUA',
  GREEN: 'GREEN',
  BLUE: 'BLUE',
  YELLOW: 'YELLOW',
  PURPLE: 'PURPLE',
  LUMINOUS_VIVID_PINK: 'LUMINOUS_VIVID_PINK',
  FUCHSIA: 'FUCHSIA',
  GOLD: 'GOLD',
  ORANGE: 'ORANGE',
  RED: 'RED',
  GREY: 'GREY',
  NAVY: 'NAVY',
  DARK_AQUA: 'DARK_AQUA',
  DARK_GREEN: 'DARK_GREEN',
  DARK_BLUE: 'DARK_BLUE',
  DARK_PURPLE: 'DARK_PURPLE',
  DARK_VIVID_PINK: 'DARK_VIVID_PINK',
  DARK_GOLD: 'DARK_GOLD',
  DARK_ORANGE: 'DARK_ORANGE',
  DARK_RED: 'DARK_RED',
  DARK_GREY: 'DARK_GREY',
  DARKER_GREY: 'DARKER_GREY',
  LIGHT_GREY: 'LIGHT_GREY',
  DARK_NAVY: 'DARK_NAVY',
  BLURPLE: 'BLURPLE',
  GREYPLE: 'GREYPLE',
  DARK_BUT_NOT_BLACK: 'DARK_BUT_NOT_BLACK',
  NOT_QUITE_BLACK: 'NOT_QUITE_BLACK',
  RANDOM: 'RANDOM',
};

const CATEGORIES = {
  utility: 'utility',
  moderation: 'moderation',
  fun: 'fun',
};

const EVENTS = {
  apiRequest: 'apiRequest',
  apiResponse: 'apiResponse',
  applicationCommandCreateD: 'applicationCommandCreateD',
  applicationCommandDeleteD: 'applicationCommandDeleteD',
  applicationCommandUpdateD: 'applicationCommandUpdateD',
  channelCreate: 'channelCreate',
  channelDelete: 'channelDelete',
  channelPinsUpdate: 'channelPinsUpdate',
  channelUpdate: 'channelUpdate',
  debug: 'debug',
  emojiCreate: 'emojiCreate',
  emojiDelete: 'emojiDelete',
  emojiUpdate: 'emojiUpdate',
  error: 'error',
  guildBanAdd: 'guildBanAdd',
  guildBanRemove: 'guildBanRemove',
  guildCreate: 'guildCreate',
  guildDelete: 'guildDelete',
  guildIntegrationsUpdate: 'guildIntegrationsUpdate',
  guildMemberAdd: 'guildMemberAdd',
  guildMemberAvailable: 'guildMemberAvailable',
  guildMemberRemove: 'guildMemberRemove',
  guildMembersChunk: 'guildMembersChunk',
  guildMemberUpdate: 'guildMemberUpdate',
  guildScheduledEventCreate: 'guildScheduledEventCreate',
  guildScheduledEventDelete: 'guildScheduledEventDelete',
  guildScheduledEventUpdate: 'guildScheduledEventUpdate',
  guildScheduledEventUserAdd: 'guildScheduledEventUserAdd',
  guildScheduledEventUserRemove: 'guildScheduledEventUserRemove',
  guildUnavailable: 'guildUnavailable',
  guildUpdate: 'guildUpdate',
  interactionD: 'interactionD',
  interactionCreate: 'interactionCreate',
  invalidated: 'invalidated',
  invalidRequestWarning: 'invalidRequestWarning',
  inviteCreate: 'inviteCreate',
  inviteDelete: 'inviteDelete',
  messageD: 'messageD',
  messageCreate: 'messageCreate',
  messageDelete: 'messageDelete',
  messageDeleteBulk: 'messageDeleteBulk',
  messageReactionAdd: 'messageReactionAdd',
  messageReactionRemove: 'messageReactionRemove',
  messageReactionRemoveAll: 'messageReactionRemoveAll',
  messageReactionRemoveEmoji: 'messageReactionRemoveEmoji',
  messageUpdate: 'messageUpdate',
  presenceUpdate: 'presenceUpdate',
  rateLimit: 'rateLimit',
  ready: 'ready',
  roleCreate: 'roleCreate',
  roleDelete: 'roleDelete',
  roleUpdate: 'roleUpdate',
  shardDisconnect: 'shardDisconnect',
  shardError: 'shardError',
  shardReady: 'shardReady',
  shardReconnecting: 'shardReconnecting',
  shardResume: 'shardResume',
  stageInstanceCreate: 'stageInstanceCreate',
  stageInstanceDelete: 'stageInstanceDelete',
  stageInstanceUpdate: 'stageInstanceUpdate',
  stickerCreate: 'stickerCreate',
  stickerDelete: 'stickerDelete',
  stickerUpdate: 'stickerUpdate',
  threadCreate: 'threadCreate',
  threadDelete: 'threadDelete',
  threadListSync: 'threadListSync',
  threadMembersUpdate: 'threadMembersUpdate',
  threadMemberUpdate: 'threadMemberUpdate',
  threadUpdate: 'threadUpdate',
  typingStart: 'typingStart',
  userUpdate: 'userUpdate',
  voiceStateUpdate: 'voiceStateUpdate',
  warn: 'warn',
  webhookUpdate: 'webhookUpdate',
};

const readFiles = async (givenPath) => {
  const results = [];

  const core = async (dir) => {
    const dirPath = path.join(__dirname, '../', dir);
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(__dirname, '../', dir, file);
      const stat = await fs.lstat(filePath);

      if (stat.isDirectory()) {
        const nextDir = path.join(dir, file);
        await core(nextDir);
      }

      if (file.endsWith('.js')) {
        results.push(filePath);
      }
    }
  };

  await core(givenPath);
  return results;
};

const checkPerm = (member, perm) => member.permissions.has(perm);

module.exports = {
  TIERS,
  COLORS,
  CATEGORIES,
  EVENTS,
  readFiles,
  checkPerm,
};
