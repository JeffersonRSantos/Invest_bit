import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('tb_wallet', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned();
        table.decimal('balance_brl', 15, 2).defaultTo(0.00);
        table.decimal('balance_btc', 17, 8).defaultTo(0.00000000);
        table.boolean('active_credit_card').defaultTo(1);
        table.timestamps(false, true);

        table.foreign('user_id').references('tb_users.id');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('tb_wallet')
}

