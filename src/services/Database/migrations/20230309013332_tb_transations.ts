import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('tb_transactions', table => {
        table.increments('id').primary();
        table.string('transaction_id').unique().notNullable();
        table.decimal('value', 15, 2).defaultTo(0.00);
        table.decimal('btc_last_cotation', 15, 2).defaultTo(0.00);
        table.decimal('btc_equivalent', 17, 8).defaultTo(0.00);
        table.integer('user_id').unsigned();
        table.integer('transaction_type', 10).notNullable();
        table.integer('transaction_status', 10).notNullable();
        table.timestamps(false, true);

        table.foreign('user_id').references('tb_users.id');
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('tb_transactions')
}
