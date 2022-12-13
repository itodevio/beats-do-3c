import { Guild, VoiceBasedChannel } from 'discord.js';
import {
  joinVoiceChannel,
  VoiceConnection,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  AudioPlayer
} from '@discordjs/voice';
import redis from '../config/redis';
import ytdl from 'ytdl-core';
import Queue from './Queue';
import { Bot } from '../utils';
import internal from 'stream';

export default class Player extends Queue {
  connection: VoiceConnection | null;
  dispatcher: AudioPlayer | null;
  bitstream: internal.Readable | null;
  volume: number;

  constructor(guild: Guild) {
    super(guild);
    this.connection = null;
    this.dispatcher = null;
    this.bitstream = null;
    this.volume = 1;
  }

  static getPlayer = (guild: Guild, bot: Bot): Player => {
    const player = bot.singleton.players.get(guild.id);

    if (player instanceof this) return player;

    bot.singleton.players.set(guild.id, new this(guild));
    return bot.singleton.players.get(guild.id)!;
  }

  join = (bot: Bot, channel: VoiceBasedChannel) => {
    this.connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    return this.connection
  }

  stream = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { queue } = await this.get(1, 1);
        const item = queue[0];


        if (!item) {
          resolve(false);
          return;
        }

        if (!this.connection) throw TypeError('No connection could be found!');

        console.log({ item })

        this.bitstream = await ytdl(item, {
          filter: 'audioonly',
          highWaterMark: 1 << 25
        });
        this.dispatcher = createAudioPlayer();

        const resource = createAudioResource(this.bitstream as any);

        this.dispatcher.play(resource);
        this.connection.subscribe(this.dispatcher);

        this.dispatcher.on(AudioPlayerStatus.Idle, async () => {
          await this.shift();
          resolve(true);
        });

        this.dispatcher.on('error', err => {
          console.log(err)
        })
      } catch (error) {
        console.error(error);
        await this.shift();
        resolve(true);
      }
    })
  }

  get status() {
    return this.dispatcher?.state.status
  }
}

