exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id');
    table.string('username').notNullable();
    table.string('mail').notNullable();
  })
  .createTable('tasks', function (table) {
    table.increments('id');
    table.string('description').notNullable();
    table.string('deadline').notNullable();
  })
  .createTable('user_to_task', function (table) {
    table.increments('id');
    table.integer('taskId').references('id').inTable('tasks');
    table.integer('userId').references('id').inTable('users');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users', 'tasks', 'user_to_task');
};
