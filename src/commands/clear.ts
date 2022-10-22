import { AudioPlayerStatus } from '@discordjs/voice';
import { Message } from 'discord.js';
import Player from '../Player';
import { Bot } from '../utils';
import CommandProcessor from './CommandProcessor';

export const clear = {
  description: '!clear (ou !c) -> limpa a playlist',
  action: async (bot: Bot, msg: Message, command: CommandProcessor) => {
    try {
      if (!msg.guild) {
        return;
      }
      
      const player = Player.getPlayer(msg.guild, bot);
      player.dispatcher?.stop();
      await player.clear();

      await msg.channel.send('Vizão')
    } catch (err) {
      console.error(err);
    }
  }
};
