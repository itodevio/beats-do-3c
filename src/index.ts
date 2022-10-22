import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { Bot, onBotReady, onMessage } from './utils';
import redis from './config/redis';
import Singleton from './singleton';

const {
  DISCORD_TOKEN,
} = process.env;


redis.connect()
  .then(() => {
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
    bot.on('messageCreate', msg => onMessage(bot as Bot, msg));
    
    bot.login(DISCORD_TOKEN);
  })

