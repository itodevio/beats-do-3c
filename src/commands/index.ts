import { Message } from 'discord.js';
import { Bot } from '../utils';
import CommandProcessor from './CommandProcessor';
import { play } from './play';

interface Command {
  [key: string]: {
    description: string;
    action: (bot: Bot, msg: Message, command: CommandProcessor) => Promise<void>
  }
}

export default {
  play,
  p: play,
} as Command;