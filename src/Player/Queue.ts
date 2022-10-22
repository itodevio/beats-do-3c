import { Guild } from 'discord.js';
import ytdl from 'ytdl-core-discord';
import redis from "../config/redis";
import { findYtUrl, getVideoDetails } from '../utils';

export default class Queue {
  guild: Guild;
  queueId: string;

  constructor(guild: Guild) {
    this.guild = guild;
    this.queueId = `${guild.id}:queue`;
  }

  add = async (arg: string) => {
    let url = arg;

    if (!ytdl.validateURL(arg)) {
      const [found_url] = await findYtUrl(arg, 1);

      if (!found_url) {
        return false;
      }
      url = found_url;
    }
    
    const data = await redis.rPush(this.queueId, url);

    if (data) {
      const video = await getVideoDetails(url);

      return video;
    }

    return false;
  }

  get = async (page: number, pageSize = 5) => {
		const validatedPage = page - 1;
		const validatedPageSize = pageSize;

		const startIndex = validatedPage * validatedPageSize;
		const endIndex = validatedPage * validatedPageSize + validatedPageSize - 1;
		const result = await redis.lRange(this.queueId, startIndex, endIndex);
		const length = await this.length();
		const pages = Math.ceil(length / validatedPageSize);

		return {
			queue: result,
			pageSize: result.length,
			startsFrom: startIndex,
			endsFrom: endIndex,
			queueLength: length,
			pages,
			page: validatedPage + 1
		};
	};

  length = async () => {
		const result = await redis.lLen(this.queueId);

		return result;
	};

  clear = async () => {
		const result = await redis.del(this.queueId);

		return result;
	};

  pop = async () => {
		const result = await redis.rPop(this.queueId);

		return result;
	};

  shift = async () => {
		const result = await redis.lPop(this.queueId);

		return result;
	};

  remove = async (index: number, value: string) => {
		const result = await redis.lRem(this.queueId, index, value);

		return result;
	};

	list = async () => {
		const redisLength = await this.length()
		const result = await redis.lRange(this.queueId, 0, redisLength);

		return result;
	}
}