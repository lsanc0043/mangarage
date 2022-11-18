/* Replace with your SQL commands */

CREATE TABLE public.manga (
    id serial primary key,
    title text NOT NULL,
    author text NOT NULL,
    year text,
    status text,
    last_updated text,
    description text,
    genres text[],
    cover text NOT NULL,
    characters text[]
);

CREATE TABLE public.users (
    id serial primary key,
    username text,
    email text NOT NULL,
    password text NOT NULL,
    last_login timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);