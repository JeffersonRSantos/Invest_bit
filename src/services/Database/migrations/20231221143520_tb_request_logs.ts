import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('tb_request_logs', table => {
        table.primary(['id','request_id']);
        table.increments('id');
        table.string('request_id').notNullable();
        table.string('endpoint', 255);
        table.string('method', 255);
        table.string('status', 3);
        table.text('payload', 'longtext');
        table.timestamps(false, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('tb_request_logs')
}

