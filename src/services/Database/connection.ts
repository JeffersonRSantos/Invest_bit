import ConfigKnex from "./config";

const knex = require('knex')(ConfigKnex);

knex.raw('CREATE DATABASE invest_bit;')
    .then(function () {
        console.log(`DB "invest_bit", created successfully`)
    })
    .catch(function () {
        console.log(`DB "invest_bit" exists`)
    })
    .finally(function () {
        console.log("Done.");
    });

export { knex }