import {Pool} from 'pg';
import {env} from './env';

export const pool = new Pool({
    connectionString: env.databseUrl,
    connectionTimeoutMillis: 10000, // Optional: Set a connection timeout
});

pool.on('error', (err) =>{
    console.error('Unexpected postgreSQL pool error', err);
});

export async function checkDatabaseConnection() {
    try {
        await pool.query('SELECT 1');
        return true;
    } catch (error) {
        console.error('Error connecting to the database', error);
        return false;
    }
}
