

DROP INDEX IF EXISTS books_title_unique_ci;

ALTER TABLE books DROP CONSTRAINT IF EXISTS books_isbn_unique;

DROP TABLE IF EXISTS book_covers;

DROP TABLE IF EXISTS books;
