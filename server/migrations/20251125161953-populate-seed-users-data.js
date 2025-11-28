'use strict';

const bcrypt = require('bcrypt');
const customersSeedData = require('../seed/seedData/customers_seed_data.json');
const adminsSeedData = require('../seed/seedData/admins_seed_data.json');
const path = require('path');
const fs = require('fs');

const filterUniqueUsers = (users) => {
  const seenUsernames = new Set();
  const seenEmails = new Set();

  const uniqueUsers = [];

  for (const user of users) {
      const { username, email } = user;

      const isDuplicate =
      seenUsernames.has(username) || seenEmails.has(email);

      if (!isDuplicate) {
          seenUsernames.add(username);
          seenEmails.add(email);
          uniqueUsers.push(user);
      }
  }

  return uniqueUsers;
};

function shuffle(array) {
  let m = array.length, t, i;

  while (m) {

    i = Math.floor(Math.random() * m--);

    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

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

exports.up = async function(db) {
  const saltRounds = 10;

  const allUniqueSeedUsers = filterUniqueUsers([...customersSeedData, ...adminsSeedData]);

  const avatarsFolder = path.join(__dirname, '../seed/seedData/avatarImages');
  const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  let insertedUsers = [];


  for (let i = 0; i < allUniqueSeedUsers.length; i++) {
    const { username, email, userType } = allUniqueSeedUsers[i];
    const hashedPassword = bcrypt.hashSync('password', saltRounds);

    const result = await db.runSql(
      `INSERT INTO users (username, email, password_hash, user_type)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id`,
      [username, email, hashedPassword, userType]
    );
    
    const userId = result.rows[0].user_id;

    insertedUsers.push({
      userId,
      index: i + 1
    });
  }

  insertedUsers = shuffle(insertedUsers); // shuffle the inserted users to avoid having the same avatar for the same user

  for (const { userId, index } of insertedUsers) {
    let selectedPath = null;
    let mimeType = null;

    for (const ext of imageExtensions) {
      const candidate = path.join(avatarsFolder, `${index}.${ext}`);

      if (fs.existsSync(candidate)) {
        selectedPath = candidate;

        if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg';
        if (ext === 'png') mimeType = 'image/png';
        if (ext === 'webp') mimeType = 'image/webp';

        break;
      }
    }

    if (!selectedPath) continue;

    const buffer = fs.readFileSync(selectedPath);

    await db.runSql(
      `INSERT INTO avatars (user_id, avatar, mime_type)
       VALUES ($1, $2, $3)`,
      [userId, buffer, mimeType]
    );    
  }

  return;
};

exports.down = async function(db) {

  await db.runSql(`DELETE FROM avatars;`);
  
  const sql = `
    DELETE FROM users
    WHERE user_type <> 'superadmin';
  `;

  return db.runSql(sql);
};

exports._meta = {
  "version": 1
};
