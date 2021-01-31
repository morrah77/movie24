import MovieRouter from './MovieRouter';
import IMovieService from '../services/IMovieService';
import e from 'express';
import {agent as request} from 'supertest';
import RouterSpecHelper from '../utils/spec/RouterSpecHelper';

describe('MovieRouter', () => {
  it('Should respond with HTTP status code 200 and expected response when no error from service', (done) => {
    let movieServiceMock: IMovieService = RouterSpecHelper.createMovieServiceMock(
      RouterSpecHelper.movieFromJSON(RouterSpecHelper.movie1JSON), undefined,
      [], undefined);
    let movieRouter: MovieRouter = new MovieRouter(movieServiceMock);
    let app: e.Application = e();
    app.use('/movie/:id', movieRouter.router);
    request(app).get('/movie/1')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(RouterSpecHelper.movie1JSON)
      .expect(200, done);
  }),

    it('Should respond with HTTP status code 404 and expected error when no result from service', (done) => {
      let movieServiceMock: IMovieService = RouterSpecHelper.createMovieServiceMock(
        undefined, undefined,
        [RouterSpecHelper.movieFromJSON(RouterSpecHelper.movie1JSON), RouterSpecHelper.movieFromJSON(RouterSpecHelper.movie1JSON)], undefined);
      let movieRouter: MovieRouter = new MovieRouter(movieServiceMock);
      let app: e.Application = e();
      app.use('/movie/:id', movieRouter.router);
      request(app).get('/movie/1')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect('{"status":404,"message":"object not found"}')
        .expect(404, done);
    }),

    it('Should respond with HTTP status code 500 and expected error when error from service', (done) => {
      let movieServiceMock: IMovieService = RouterSpecHelper.createMovieServiceMock(
        undefined, new Error("Something went wrong"),
        [RouterSpecHelper.movieFromJSON(RouterSpecHelper.movie1JSON), RouterSpecHelper.movieFromJSON(RouterSpecHelper.movie1JSON)], undefined);
      let movieRouter: MovieRouter = new MovieRouter(movieServiceMock);
      let app: e.Application = e();
      app.use('/movie/:id', movieRouter.router);
      request(app).get('/movie/1')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect('{"status":500,"message":"internal server error"}')
        .expect(500, done);
    })
});
