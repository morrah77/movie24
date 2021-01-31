import Movie from '../../models/Movie';
import IMovieService from '../../services/IMovieService';

export default class RouterSpecHelper {
  static movie1JSON: string = '{"id":41,"title":"My Movie 41","description":"Descr 41","short_description":"Short descr 41","duration":28305,"release_date":"1950-05-11T10:50:16.000Z","genres":["Science Fiction"],"images":{"cover":"3454.jpg","poster":"5103.jpg"}}';

  static movie2JSON: string = '{"id":39,"title":"My Movie 39","description":"Descr 39","short_description":"Short descr 39","duration":20753,"release_date":"1951-07-25T10:50:16.000Z","genres":["Science Fiction","Comedy"],"images":null}'

  static createMovieServiceMock(singleResult: void|Movie, singleError: void|Error, listResult: void|Array<Movie>, listError: void|Error): IMovieService {
    return  new class implements IMovieService {
      getMovieById(id: string | undefined): Promise<void | Movie> {
        return new Promise((resolve, reject) => {
          if(singleError) {
            reject(singleError);
            return;
          }
          resolve(singleResult)});
      }

      getMovies(page: number, perPage: number, orderBy: string, order: string): Promise<void | Array<Movie>> {
        return new Promise((resolve, reject) => {
          if(listError) {
            reject(listError);
            return;
          }
          resolve(listResult)
        });
      }
    }
  }

  static movieFromJSON(json: string): Movie {
    return JSON.parse(json);
  }
}