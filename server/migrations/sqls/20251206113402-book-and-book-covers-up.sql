


CREATE TABLE IF NOT EXISTS books (
    book_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    synopsis TEXT,
    authors JSONB NOT NULL DEFAULT '[]',
    isbn TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    year_published INTEGER NOT NULL,
    language TEXT NOT NULL,
    pages INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS book_covers (
    book_cover_id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    image_data BYTEA NOT NULL,
    mime_type TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE books ADD CONSTRAINT books_isbn_unique UNIQUE (isbn);

ALTER TABLE book_covers
ADD CONSTRAINT book_covers_book_id_unique UNIQUE (book_id);

/*
    Case-insensitive unique index on title column.
*/
CREATE UNIQUE INDEX IF NOT EXISTS books_title_unique_ci
ON books (LOWER(title));
