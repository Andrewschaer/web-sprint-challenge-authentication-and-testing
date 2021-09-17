exports.seed = function(knex, Promise) {
  return knex('users')
    .truncate()
    .then(function() {
      return knex('users').insert([
        { username: 'testU0', password: 'testP0' }
      ]);
    });
};