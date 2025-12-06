


CREATE TABLE IF NOT EXISTS books (
    book_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    synopsis TEXT,
    authors JSONB NOT NULL DEFAULT '[]',
    isbn VARCHAR(32),
    price NUMERIC(10, 2) NOT NULL,
    date_published VARCHAR(32),
    language VARCHAR(16),
    pages INTEGER,

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
