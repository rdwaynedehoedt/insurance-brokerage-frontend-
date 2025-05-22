/**
 * Migration script to remove the sales_rep_id field from the clients table
 * 
 * To run:
 * 1. Make sure your MySQL server is running
 * 2. Update the connection details below as needed
 * 3. Run: node scripts/remove-sales-rep-field.js
 */

const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // Using empty password by default
  database: process.env.DB_NAME || 'insurance_brokerage',
};

async function runMigration() {
  let connection;

  try {
    console.log('Connecting to database...');
    console.log('Using database configuration:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      passwordProvided: dbConfig.password ? 'Yes' : 'No'
    });

    connection = await mysql.createConnection(dbConfig);
    
    // Check if sales_rep_id column exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'clients' AND COLUMN_NAME = 'sales_rep_id'
    `, [dbConfig.database]);

    if (columns.length === 0) {
      console.log('sales_rep_id column does not exist. No action needed.');
      return;
    }

    // Find foreign keys referencing this column
    console.log('Checking for foreign key constraints...');
    const [fks] = await connection.execute(`
      SELECT CONSTRAINT_NAME 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'clients' 
        AND COLUMN_NAME = 'sales_rep_id' 
        AND REFERENCED_TABLE_NAME IS NOT NULL;
    `, [dbConfig.database]);

    // Remove any foreign key constraints
    for (const fk of fks) {
      console.log(`Removing foreign key constraint: ${fk.CONSTRAINT_NAME}`);
      await connection.execute(`ALTER TABLE clients DROP FOREIGN KEY ${fk.CONSTRAINT_NAME}`);
    }

    // Check for indexes on the column
    console.log('Checking for indexes...');
    const [indexes] = await connection.execute(`
      SHOW INDEX FROM clients WHERE Column_name = 'sales_rep_id';
    `);

    // Remove indexes
    for (const idx of indexes) {
      console.log(`Removing index: ${idx.Key_name}`);
      if (idx.Key_name !== 'PRIMARY') { // Don't try to remove primary key
        await connection.execute(`ALTER TABLE clients DROP INDEX ${idx.Key_name}`);
      }
    }

    // Remove the sales_rep_id column
    console.log('Removing sales_rep_id column from clients table...');
    await connection.execute('ALTER TABLE clients DROP COLUMN sales_rep_id');
    
    console.log('Migration successful! sales_rep_id column removed from clients table.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

runMigration(); 