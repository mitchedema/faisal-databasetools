const { Pool } = require('pg');

// create a client instance of the pg library
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "faisalcids",
    password: "Arielfluffy1",
    port: "5432"
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
});

//attempt connection 10 times incase of delay
(async () => {
    let retries = 10;
    while (retries) {
        try {
            const client = await pool.connect();
            client.release();
            break;
        } catch (err) {
            retries -= 1;
            console.log(`Retries left: ${retries}`);
            if (!retries) {
                throw Error(`Error connecting to the database:\n ${err}`);
            }
            await new Promise(res => setTimeout(res, 5000));
        }
    }
})();

module.exports = pool;
