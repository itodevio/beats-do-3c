import { Message } from 'discord.js';
import { Bot } from '../utils';
import CommandProcessor from './CommandProcessor';
import { play } from './play';
import { clear } from './clear';
import { skip } from './skip';

interface Command {
  [key: string]: {
    description: string;
    action: (bot: Bot, msg: Message, command: CommandProcessor) => Promise<void>
  }
}

export default {
  play,
  p: play,
  clear,
  c: clear,
  skip,
  s: skip,
} as Command;