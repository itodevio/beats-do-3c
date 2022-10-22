import { Message } from 'discord.js';
import Player from '../Player';
import { Bot } from '../utils';
import CommandProcessor from './CommandProcessor';

export const play = {
  description: '!play (ou !p) <url do youtube/pesquisa no youtube> -> adiciona um vídeo do youtube na playlist',
  action: async (bot: Bot, msg: Message, command: CommandProcessor) => {
    try {
      if (!msg.guild) {
        return;
      }
      
      const player = Player.getPlayer(msg.guild, bot);
      const video = await player.add(command.cmdArgs.join(' '));
      const playing = player.status
      const channel = msg.member!.voice.channel!;
      const connected = await player.join(bot, channel);


      while (await player.stream());


    } catch (err) {
      console.error(err);
    }
  }
};
