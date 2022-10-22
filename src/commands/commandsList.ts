import { Message } from 'discord.js';
import commandsList from '.';
import { Bot } from '../utils';
import CommandProcessor from './CommandProcessor';

export const commands = {
  description: '!commandsList -> lista de comandos do 3c',
  action: async (bot: Bot, msg: Message, command: CommandProcessor) => {
    try {
      if (!msg.guild) {
        return;
      }

      const commandsArrayList = Object.keys(commandsList);
      let msg3c = '';
      commandsArrayList.forEach((command) => {
        msg3c += ` !${command}`
      });
      
      await msg.channel.send(`Se liga nessa lista comandos muito CHAVE parsa \n${msg3c}`);

      
    } catch (err) {
      console.error(err);
    }
  }
};
