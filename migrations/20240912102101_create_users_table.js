exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id'); // Primary key
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('role').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
