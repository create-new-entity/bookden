'use strict';

const bcrypt = require('bcrypt');

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  const username = process.env.FIRST_SUPERADMIN_USERNAME;
  const email = 'superadmin@example.com';
  const password = process.env.FIRST_SUPERADMIN_PASSWORD;
  const userType = 'superadmin';
  const isActive = true;

  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  // Correct signature: db.insert(table, columns[], values[])
  return db.insert(
    'users',
    ['username', 'email', 'password_hash', 'user_type', 'is_active'],
    [username, email, hashedPassword, userType, isActive]
  );
};

exports.down = function(db) {
  const username = process.env.FIRST_SUPERADMIN_USERNAME;
  return db.runSql(`DELETE FROM users WHERE username = '${username}'`);
};

exports._meta = {
  "version": 1
};
