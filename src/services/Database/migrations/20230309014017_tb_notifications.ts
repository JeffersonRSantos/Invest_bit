import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('tb_notifications', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned();
        table.text('content_notification', 'longtext').notNullable();
        table.integer('method_send', 10).notNullable();
        table.integer('status_send', 10).notNullable();
        table.timestamps(false, true);

        table.foreign('user_id').references('tb_users.id');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('tb_notifications')
}

