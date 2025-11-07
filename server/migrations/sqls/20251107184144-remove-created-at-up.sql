

/*
    is_active. Not created_at.
*/

ALTER TABLE users
DROP COLUMN IF EXISTS is_active;