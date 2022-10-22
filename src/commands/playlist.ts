import { Message, messageLink } from 'discord.js';
import Player from '../Player';
import { Bot, getVideoDetails } from '../utils';
import CommandProcessor from './CommandProcessor';

export const playlist = {
  description: '!list -> retorna a listagem de músicas na queue',
  action: async (bot: Bot, msg: Message, command: CommandProcessor) => {
    try {
      if (!msg.guild) {
        return;
      }
      
      const player = Player.getPlayer(msg.guild, bot);
      const result = await player.list();

      const queue = await Promise.all(result.map(async (url) => {
        const videoInfo = await getVideoDetails(url)

        return videoInfo.videoDetails.title;
      }));

      const formatQueue = queue.map((title, index) => {
        return `${index+1} - ${title}`
      });

      await msg.channel.send(`Toma a lista parsa \n${formatQueue.join('\n')}`);

    } catch (err) {
      console.error(err);
    }
  }
};
