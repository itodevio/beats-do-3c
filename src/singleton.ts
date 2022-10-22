import { Collection } from 'discord.js';
import Player from './Player';

export default class Singleton {
  players: Collection<string, Player>;
  skip: boolean;

  constructor() {
    this.players = new Collection();
    this.skip = false;
  }
}