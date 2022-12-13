import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { Bot, onBotReady, onMessage } from './utils';
import redis from './config/redis';
import Singleton from './singleton';
import keepAlive from './server';
import { exec } from 'node:child_process';

const {
  DISCORD_TOKEN,
} = process.env;


redis.connect()
  .then(async () => {
    const bot: Client & { singleton?: Singleton } = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
      ]
    });

    bot.singleton = new Singleton();

    bot.on('ready', () => onBotReady(bot as Bot));
    bot.on('error', (err) => console.log(err))
    bot.on('messageCreate', msg => onMessage(bot as Bot, msg));

    console.log('vamo familia')
    console.log(DISCORD_TOKEN)
    try {
      await bot.login(DISCORD_TOKEN);
    } catch (err) {
      exec("kill 1")
      console.log(err)
    }
    keepAlive();
  })
  .catch(err => console.log(err))

