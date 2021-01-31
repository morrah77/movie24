CREATE TABLE IF NOT EXISTS public.genre (
  id serial PRIMARY KEY,
  name character varying(200) UNIQUE NOT NULL,
  description text
);
ALTER TABLE public.genre OWNER TO movie_user;

-- hardly the valid image type set has to be changeable, but,
-- to have an ability to use standard SQL operations on image types, let's don't use ENUM here
CREATE TABLE IF NOT EXISTS public.image_type (
  id serial PRIMARY KEY,
  name character varying(50) UNIQUE NOT NULL
);
ALTER TABLE public.image_type OWNER TO movie_user;

CREATE TABLE IF NOT EXISTS public.movie (
    id serial PRIMARY KEY,
    title character varying(200),
    description text,
    short_description character varying(500),
    duration integer,
    release_date timestamp without time zone
);
ALTER TABLE public.movie OWNER TO movie_user;

CREATE TABLE IF NOT EXISTS public.movie_image (
  image_type_id integer REFERENCES public.image_type (id),
  movie_id integer REFERENCES public.movie (id),
  url character varying(250)
);
ALTER TABLE public.movie_image OWNER TO movie_user;

CREATE TABLE IF NOT EXISTS public.movie_genre (
  genre_id integer REFERENCES public.genre (id),
  movie_id integer REFERENCES public.movie (id)
);
ALTER TABLE public.movie_genre OWNER TO movie_user;

INSERT INTO public.image_type (name) VALUES ('cover'), ('poster'), ('preview');

INSERT INTO public.genre (name, description) VALUES ('Science Fiction', 'Science Fiction description'), ('Comedy', 'Comedy description'), ('Drama', 'Drama description');
