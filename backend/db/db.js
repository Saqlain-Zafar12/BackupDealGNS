const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'beyond2023',
    port: 5432,
  });

// Function to check database connection
const checkDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database');
    client.release();
    return true;
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    return false;
  }
};

// Execute the connection check when this module is imported
checkDatabaseConnection();

module.exports = pool;
