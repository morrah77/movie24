import path from 'path'
import {readFileSync} from 'fs';

export default class Config extends Object {
  pg: Object;
  server: ConfigServer;
  private static instance: Config;
  private constructor() {
    console.log('Creating new config');
    let environment = process.env['NODE_ENV'] || 'dev';
    let configPath = process.env['CONFIG_PATH'] || `./env/${environment}.config.json`;
    let configContents = readFileSync(path.resolve(configPath), {encoding: 'utf-8'});
    let configObject = JSON.parse(configContents);
    super();
    this.pg = {};
    this.server = {
      port: 3000,
      version: '0'
    };
    Object.assign(this.pg, configObject.pg);
    Object.assign(this.server, configObject.server);
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new Config();
    }
    return this.instance;
  }
}

export interface ConfigServer {
  port: number;
  version: string
}
