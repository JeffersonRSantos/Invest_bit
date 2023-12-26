import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('tb_queue_logs', table => {
        table.primary(['id','queue_id']);
        table.increments('id');
        table.string('queue_id').notNullable();
        table.string('status', 3);
        table.text('payload', 'longtext');
        table.timestamps(false, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('tb_queue_logs')
}

