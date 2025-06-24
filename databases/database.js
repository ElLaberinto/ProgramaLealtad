import PG from "pg";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV == "production";
const Pool = PG.Pool;
const connectionString = isProduction ? 
    process.env.POSTGRES_URL : process.env.LOCAL_POSTGRES_URL;
 

const pool = new Pool({
    connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

export default pool;