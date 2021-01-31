import {NextFunction, Request, Response, Router} from 'express';
import winston from 'winston'
import {parseIntOrUndefined, parseStringOrUndefined} from '../utils/ParamParserUtil'
import Error from '../models/errors/Error';
import IMovieService from '../services/IMovieService';
import {VaidateRequest} from '../middlewares'

export default class MoviesRouter {
  private _router: Router;
  private logger: winston.Logger;
  private movieService: IMovieService;

  constructor(movieService: IMovieService) {
    this._router = Router({mergeParams: true});
    this.logger = winston.createLogger({
      transports: [new winston.transports.Console()],
      level: 'debug',
      defaultMeta: {source: 'MoviesRouter'}
    });
    this.movieService = movieService;

    this._router.get('/', VaidateRequest,  this.handleGetMovies.bind(this));
  }

  private handleGetMovies(req: Request, res: Response, next: NextFunction): void {
    const {page, perPage, orderBy, order} = req.query;
    this.movieService.getMovies(parseIntOrUndefined(page), parseIntOrUndefined(perPage),
      parseStringOrUndefined(orderBy), parseStringOrUndefined(order))
      .then(result => {
        this.logger.debug(`Got result ${result}`);
        res.json(result);
      })
      .catch(e => {
        this.logger.error(e);
        res.status(500);
        res.json(new Error(500, 'internal server error'))
      });
  }

  get router(): Router {
    return this._router;
  }
};
