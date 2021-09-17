const db = require('../../data/dbConfig');

function getAllUsers() {
    return db('users');
}

function findByUsername(username) {
    return db('users')
        .where('users.username', username)
        .first();
}

function findById(id) {
    return db('users')
        .where('users.id', id)
        .first();
}

function add(newUser) { // done for you
    return db('users')
        .insert(newUser)
        .then(([id]) => findById(id));
}

module.exports = {
  getAllUsers,
  findByUsername,
  findById,
  add,
};
