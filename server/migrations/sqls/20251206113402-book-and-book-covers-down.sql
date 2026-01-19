

DROP INDEX IF EXISTS books_title_unique_ci;

ALTER TABLE books DROP CONSTRAINT IF EXISTS books_isbn_unique;

ALTER TABLE book_covers DROP CONSTRAINT IF EXISTS book_covers_book_id_unique;

DROP TABLE IF EXISTS book_covers;

DROP TABLE IF EXISTS books;
