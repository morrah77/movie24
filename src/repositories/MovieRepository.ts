import {Pool, QueryConfig} from 'pg';
import {createLogger, Logger, transports} from 'winston';
import Config from '../config/Config';
import Movie, {MovieImages} from '../models/Movie';
import MovieSQL from './MovieSQL';

export default class MovieRepository {
  private pool: Pool;
  private logger: Logger;
  private static instance: MovieRepository;

  private constructor() {
    console.log('Creating new MovieRepository');
    let config: Config = Config.getInstance();
    this.logger = createLogger({transports: [new transports.Console()], level: 'debug', defaultMeta: {source: 'MovieRepository'}});
    this.pool = new Pool(config.pg);
    this.logger.debug(`MovieRepository initialized with ${config}`, config);
  }

  public getMovieById(id: string): Promise<void|Movie> {
    let logger: Logger = this.logger;
    const queryConfig: QueryConfig = {
      text: MovieSQL.movieSelectText +
        `WHERE id=$1;`,
      values: [id]
    };
    logger.debug(`Calling database with query ${queryConfig.text}`, {queryConfig});
    return this.pool.query(queryConfig)
      .then(result => {
        logger.debug(result);
        if (result.rows[0].images && (typeof result.rows[0].images === "object") && (typeof result.rows[0].images.length !== "undefined")) {
          result.rows[0].images = MovieImages.of(result.rows[0].images);
        }

        return result.rows[0];
      })
      .catch(e => {this.logger.debug(e)});
  }

  public getMovies(offset: number = 0, limit: number = 10, orderBy: string = 'id', order: string = 'ASC'): Promise<void|Array<Movie>> {
    let logger: Logger = this.logger;
    const queryConfig: QueryConfig = {
      text: MovieSQL.movieSelectText +
        `ORDER BY m.${orderBy} ${order} LIMIT $1 OFFSET $2;`,
      values: [limit, offset]
    };
    logger.debug(`Calling database with query ${queryConfig.text}`, {queryConfig});
    return this.pool.query(queryConfig)
      .then(result => {
        logger.debug(result.rows);
        result.rows.forEach(
          (row: any, index: number, array) => {
            if (row.images && (typeof row.images === "object") && (typeof row.images.length !== "undefined")) {
              row.images = MovieImages.of(row.images);
            }
          }
        );
        return result.rows;
      })
      .catch(e => {
        this.logger.debug(e)
        throw e;
      });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new MovieRepository();
    }
    return this.instance;
  }
}