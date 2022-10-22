import { AudioPlayerStatus } from '@discordjs/voice';
import { Message } from 'discord.js';
import Player from '../Player';
import { Bot } from '../utils';
import CommandProcessor from './CommandProcessor';

export const skip = {
  description: '!skip (ou !s) -> pula o vídeo atual',
  action: async (bot: Bot, msg: Message, command: CommandProcessor) => {
    try {
      if (!msg.guild) {
        return;
      }
      
      const player = Player.getPlayer(msg.guild, bot);
      player.dispatcher?.stop();
      
      await player.shift();

      msg.channel.send('Skippado parsa')
    } catch (err) {
      console.error(err);
    }
  }
};
