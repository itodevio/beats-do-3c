const API_KEY = process.env.GPT_API_TOKEN;
const axios = require('axios');

import { Message } from 'discord.js';
import { GPT_API_ENDPOINT } from 'src/constants';
import { Bot } from '../utils';
import CommandProcessor from './CommandProcessor';

const input = {
    model: "text-davinci-002",
    max_tokens: 50,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
};

export const gpt = {
  description: '!gpt mande uma mensage para ChatGPT responder',
  action: async (bot: Bot, msg: Message, command: CommandProcessor) => {
    try {
      if (!msg.guild) {
        return;
      }

        axios.post(GPT_API_ENDPOINT, {...input, prompt: command.cmdArgs.join(' ')}, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        }
        })
        .then((response: any) =>  {
            msg.channel.send(response.data.choices[0].text)
        })
        .catch((error: any) => console.error(error));


    } catch (err) {
      console.error(err);
    }
  }
};
