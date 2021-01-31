export default class MovieSQL {
  public static movieSelectText: string =
    `
    select
       m.*,
       array(select b.name  from movie_genre a inner join genre b on a.genre_id=b.id where a.movie_id=m.id) as genres,
       (select array_to_json(array_agg(image_rows)) from (select b.name, a.url from movie_image a inner join image_type b on a.image_type_id=b.id where a.movie_id=m.id) image_rows) as images
from movie m
    `;
}