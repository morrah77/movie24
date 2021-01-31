import e from 'express';
import morgan from 'morgan'
import cookieParser from 'cookie-parser';
import MoviesRouter from '../routes/MoviesRouter';
import MovieRouter from '../routes/MovieRouter';
import Config from '../config/Config';
import MovieService from '../services/MovieService';
import {AddJsonContentTypeHeaders} from '../middlewares';
import IMovieService from '../services/IMovieService';

export default class AppServer {
  private _express: e.Application;
  private config: Config;

  constructor(config: Config) {
    this.config = config;
    this._express = e();

    this._express.use(morgan('dev'));
    this._express.use(cookieParser());
    this._express.use(e.json());
    this._express.use(e.urlencoded({extended: false}));

    this._express.use('/', AddJsonContentTypeHeaders);

    let movieService: IMovieService = MovieService.getInstance();
    this._express.use('/movies', new MoviesRouter(movieService).router);
    this._express.use('/movie/:id', new MovieRouter(movieService).router);

    this._express.set('port', config.server.port);
  }

  get express(): e.Application {
    return this._express;
  }
}
