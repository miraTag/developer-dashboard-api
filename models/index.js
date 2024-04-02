import Sequelize from "sequelize";
import { DB_CONNECTION, DB_HOST, DB_NAME, DB_PORT } from "../config.mjs";
const { username, password } = DB_CONNECTION;

export const sequelize = new Sequelize(DB_NAME, username, password, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
});
