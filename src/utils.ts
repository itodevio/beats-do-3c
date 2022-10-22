import { youtube, youtube_v3 } from '@googleapis/youtube';
import ytdl from 'ytdl-core';
import { Client, Message } from 'discord.js'
import CommandProcessor from './commands/CommandProcessor';
import commands from './commands';
import redis from './config/redis';
import Singleton from './singleton';

export type Bot = Client & { singleton: Singleton }; 

export const onBotReady = (bot: Bot) => {
  console.log('To on')
}

export const onMessage = (bot: Bot, msg: Message) => {
  if (!msg.content.trim().startsWith('!')) return;

  const command = new CommandProcessor(msg);
  
  if (Object.keys(commands).includes(command.cmd)) {
    commands[command.cmd].action(bot, msg, command);
  }
}

export const findYtUrl = (search: string, maxResults = 1): Promise<string[]> => {
  return new Promise(async (resolve, reject) => {
    const yt = youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_TOKEN
    })
  
    const params: youtube_v3.Params$Resource$Search$List = {
      part: ['id'],
      maxResults,
      type: ['video'],
      q: search
    };
  
    yt.search.list(params, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      }
  
      if (!err && data) {
        resolve(data.data.items!.map(({ id }) => `https://www.youtube.com/watch?v=${id?.videoId}`))
      }
    })
  })
}

export const getVideoDetails = async (url: string) => {
  try {
    if (!ytdl.validateURL(url)) return false;

    const fromCache = await redis.get(`youtube:${url}`);

    if (fromCache) {
      return JSON.parse(fromCache);
    }

    const videoDetails = await ytdl.getBasicInfo(url);

    await redis.set(`youtube:${url}`, JSON.stringify(videoDetails));
    await redis.expire(`youtube:${url}`, 86400);

    return videoDetails;
  } catch (error) {
    console.error(error)
    return false;
  }
}
