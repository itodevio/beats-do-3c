import { Collection } from 'discord.js';
import Player from './Player';

export default class Singleton {
  players: Collection<string, Player>;

  constructor() {
    this.players = new Collection();
  }
}