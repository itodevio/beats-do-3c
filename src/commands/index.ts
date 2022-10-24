import { Message } from 'discord.js';
import { Bot } from '../utils';
import CommandProcessor from './CommandProcessor';
import { play } from './play';
import { playlist } from './playlist';
import { clear } from './clear';
import { skip } from './skip';
import { commands } from './commands';

interface Command {
  [key: string]: {
    id: string;
    description: string;
    action: (bot: Bot, msg: Message, command: CommandProcessor) => Promise<void>
  }
}

const commandsList = {
  play,
  p: play,
  playlist,
  pl: playlist,
  list: playlist,
  l: playlist,
  clear,
  c: clear,
  skip,
  s: skip,
  commands,
  com: commands,
}

export default commandsList as Command;