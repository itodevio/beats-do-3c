import { Message } from 'discord.js';

export default class CommandProcessor {
  msg: string;
  prefix: string;
  cmd: string;
  cmdArgs: string[];

  constructor(msg: Message) {
    this.prefix = "!";
    this.msg = msg.content.trim(); // !p kendrick baby keem

    const splittedMsg = this.msg.substring(this.prefix.length).split(' '); 

    this.cmd = splittedMsg[0].toLowerCase(); 
    this.cmdArgs = splittedMsg.slice(1); 
  }
}