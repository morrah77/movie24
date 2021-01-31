import Movie from '../models/Movie';

export default interface IMovieService {
  getMovies(page: number|undefined, perPage: number|undefined, orderBy: string|undefined, order: string|undefined): Promise<void|Array<Movie>>;

  getMovieById(id: string|undefined): Promise<void|Movie>;
}