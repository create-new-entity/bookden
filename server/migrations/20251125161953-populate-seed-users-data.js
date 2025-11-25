'use strict';

const bcrypt = require('bcrypt');
const customersSeedData = require('../seed/seedData/customers_seed_data.json');
const adminsSeedData = require('../seed/seedData/admins_seed_data.json');

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
  const saltRounds = 10;

  const usersInsertPromises = [...customersSeedData, ...adminsSeedData].map(({ username, email, userType }) => {
    const hashedPassword = bcrypt.hashSync('password', saltRounds);
    return db.insert(
      'users',
      ['username', 'email', 'password_hash', 'user_type'],
      [username, email, hashedPassword, userType]
    );
  });

  return Promise.all(usersInsertPromises);
};

exports.down = function(db) {
  const sql = `
    DELETE FROM users
    WHERE user_type <> 'superadmin';
  `;

  return db.runSql(sql);
};

exports._meta = {
  "version": 1
};
