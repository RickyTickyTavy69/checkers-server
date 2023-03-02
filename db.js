import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();
const {Pool} = pkg;

const pool = new Pool({
    user: "postgres",
    password: "nuncarendirse666",
    host: "localhost",
    port: 5432,
    database: "dame_postgres",
});

export default pool;