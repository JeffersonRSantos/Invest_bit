import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('tb_users', table => {
        table.increments('id').unsigned();
        table.string('name_full', 255).notNullable();
        table.string('email', 255).unique().notNullable();
        table.string('password', 255).notNullable();
        table.timestamps(false, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
      .dropTable("tb_users");
}

