export default class Movie {
  title: string;
  description?: string;
  short_description?: string;
  duration?: number;
  release_date?: string;
  images?: MovieImages;
  genres?: Array<string>;
  constructor(title: string, description: string,
  short_description: string, duration: number,
  release_date: string, images: MovieImages,
  genres: Array<string>) {
    this.title = title;
    this.description = description;
    this.short_description = short_description;
    this.duration = duration;
    this.release_date = release_date;
    this.images = images;
    this.genres = genres;
  }
}

export class MovieImages {
  cover?: string;
  poster?: string;

  constructor(cover: string, poster: string) {
    this.cover = cover;
    this.poster = poster;
  }

  static of(rawImagesArray: {name: string, url: string}[]): MovieImages {
    return rawImagesArray.reduce(
      (acc: object, item: {name: string, url: string}) => {
        // @ts-ignore
        acc[item.name] = item.url;
        return acc;
      },
      {}
    );
  }
}