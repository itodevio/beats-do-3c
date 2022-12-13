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
      player.join(bot, channel);

      msg.channel.send(`Se liga nesse beat cuzão: ${video.title}`)

      if (!playing || playing !== 'playing') {
        while (await player.stream());
        msg.channel.send(`To marchando família, cabo as track`)
        player.connection?.disconnect();
      }
    } catch (err) {
      console.error(err);
    }
  }
};
