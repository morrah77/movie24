import MoviesRouter from './MoviesRouter';
import IMovieService from '../services/IMovieService';
import e from 'express';
import {agent as request} from 'supertest';
import RouterSpecHelper from '../utils/spec/RouterSpecHelper';

describe('MoviesRouter', () => {
  it('Should respond with HTTP status code 200 and expected response when no error from service', (done) => {
    let movieServiceMock: IMovieService = RouterSpecHelper.createMovieServiceMock(
      RouterSpecHelper.movieFromJSON(RouterSpecHelper.movie1JSON), undefined,
      [
        RouterSpecHelper.movieFromJSON(RouterSpecHelper.movie1JSON),
        RouterSpecHelper.movieFromJSON(RouterSpecHelper.movie2JSON)
      ], undefined);
    let movieRouter: MoviesRouter = new MoviesRouter(movieServiceMock);
    let app: e.Application = e();
    app.use('/movies/', movieRouter.router);
    request(app).get('/movies')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect('[' + RouterSpecHelper.movie1JSON + ',' + RouterSpecHelper.movie2JSON + ']')
      .expect(200, done);
  }),

    it('Should respond with HTTP status code 200 and empty array when no result from service', (done) => {
      let movieServiceMock: IMovieService = RouterSpecHelper.createMovieServiceMock(
        undefined, undefined,
        [], undefined);
      let movieRouter: MoviesRouter = new MoviesRouter(movieServiceMock);
      let app: e.Application = e();
      app.use('/movies/', movieRouter.router);
      request(app).get('/movies')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect('[]')
        .expect(200, done);
    }),

    it('Should respond with HTTP status code 500 and expected error when error from service', (done) => {
      let movieServiceMock: IMovieService = RouterSpecHelper.createMovieServiceMock(
        undefined, undefined,
        undefined, new Error("Something went wrong"));
      let movieRouter: MoviesRouter = new MoviesRouter(movieServiceMock);
      let app: e.Application = e();
      app.use('/movies/', movieRouter.router);
      request(app).get('/movies')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect('{"status":500,"message":"internal server error"}')
        .expect(500, done);
    })
});
