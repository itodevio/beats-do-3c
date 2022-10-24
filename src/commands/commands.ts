import { Message } from 'discord.js';
import commandsList from '.';
import { Bot } from '../utils';
import CommandProcessor from './CommandProcessor';

type CommandDescription = {
  [commandId: string]: {
    commands: Array<keyof typeof commandsList>;
    description: string;
  }
}

export const commands = {
  id: 'commands',
  description: 'Lista de comandos do 3c',
  action: async (bot: Bot, msg: Message, command: CommandProcessor) => {
    try {
      if (!msg.guild) {
        return;
      }

      const commandsObj = Object.entries(commandsList).reduce((prev, curr) => {
        if (prev[curr[1].id]) {
          prev[curr[1].id].commands.push(`!${curr[0]}`);
        } else {
          prev[curr[1].id] = {
            commands: [`!${curr[0]}`],
            description: curr[1].description
          }
        }

        return prev;
      }, {} as CommandDescription);

      let msg3c = '';

      Object.values(commandsObj).forEach((command) => {
        msg3c += `\n**${command.commands.join(', ')}** -> ${command.description}`;
      });
      
      await msg.channel.send(`Se liga nessa lista comandos muito **CHAVE** parsa ${msg3c}`);

      
    } catch (err) {
      console.error(err);
    }
  }
};
