CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

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

CREATE TABLE readmangas (
    user_id int not null, 
    manga_id int not null, 
    rating decimal not null, 
    PRIMARY KEY (user_id, manga_id), 
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE, 
    FOREIGN KEY (manga_id) REFERENCES manga(id) ON UPDATE CASCADE
);

CREATE TABLE public.users (
    id serial primary key,
    username text,
    email text NOT NULL,
    password text NOT NULL,
    last_login timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);