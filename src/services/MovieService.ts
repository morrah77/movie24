import Movie from '../models/Movie';
import Config from '../config/Config'
import winston from 'winston'
import MovieRepository from '../repositories/MovieRepository';
import IMovieService from './IMovieService'

export default class MovieService implements IMovieService {
  private logger: winston.Logger;
  private repository: MovieRepository;
  private static instance: MovieService;

  private constructor() {

    console.log('Creating new MovieService');
    let config: Config = Config.getInstance();
    this.logger = winston.createLogger({transports: [new winston.transports.Console()], level: 'debug', defaultMeta: {source: 'movieService'}});
    this.repository = MovieRepository.getInstance();
  }

  public getMovies(page: number = 0, perPage: number = 10, orderBy: string = 'title', order: string = 'ASC'): Promise<void|Array<Movie>> {
    this.logger.debug(`params: ${page}, ${perPage}, ${orderBy}, ${order} `, {params: {page, perPage, orderBy, order}});
    let offset = page * perPage;
    return this.repository.getMovies(offset, perPage, orderBy, order)
    .catch(e => {
        this.logger.debug(e);
        throw(e);
    });
  }

  public getMovieById(id: string = ''): Promise<void|Movie> {
      this.logger.debug(`id: ${id} `);
      return this.repository.getMovieById(id)
      .catch(e => {
          this.logger.debug(e);
          throw(e);
      });
    }

  static getInstance() {
    if (!this.instance) {
      this.instance = new MovieService();
    }
    return this.instance;
  }
}