
import { Knex } from 'knex';
import ConfigKnex from './src/services/Database/config'
require('dotenv').config()

const config: { [key: string]: Knex.Config } = {
  development: ConfigKnex
};

module.exports = config[`${process.env.NODE_ENV}`];
