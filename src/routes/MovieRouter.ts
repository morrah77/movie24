import {NextFunction, Request, Response, Router} from 'express';
import IMovieService from '../services/IMovieService';
import winston from 'winston'
import {parseStringOrUndefined} from '../utils/ParamParserUtil'
import Error from '../models/errors/Error';
import {VaidateRequest} from '../middlewares'

export default class MovieRouter {
  private _router: Router;
  private logger: winston.Logger;
  private movieService: IMovieService;

  constructor(movieService: IMovieService) {
    this._router = Router({mergeParams: true});
    this.logger = winston.createLogger({
      transports: [new winston.transports.Console()],
      level: 'debug',
      defaultMeta: {source: 'MovieRouter'}
    });
    this.movieService = movieService;

    this._router.get('/', VaidateRequest, this.handleGetMovie.bind(this));
  }

  private handleGetMovie(req: Request, res: Response, next: NextFunction): void {
    const id = req.params.id;
    this.movieService.getMovieById(parseStringOrUndefined(id))
      .then(result => {
        this.logger.debug(`Got result: `, result);
        if (result) {
          res.json(result);
          return;
        }
        res.status(404);
        res.json(new Error(404, 'object not found'));
        res.end();
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
}
