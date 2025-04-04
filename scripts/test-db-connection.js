require('dotenv').config();
const { Sequelize } = require('sequelize');

// Database configuration from .env
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_NAME = process.env.DB_NAME || 'quizlearn';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASS = process.env.DB_PASS || '';
const DB_PORT = parseInt(process.env.DB_PORT || '5432');

// Create Sequelize instance
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false, // Disable logging for cleaner output
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection to PostgreSQL database has been established successfully.');
    
    // List all tables directly with a raw SQL query
    const [tables] = await sequelize.query(`
      SELECT 
        tablename 
      FROM 
        pg_catalog.pg_tables 
      WHERE 
        schemaname = 'public'
    `);
    
    console.log('\n📋 Tables in database:');
    if (tables.length === 0) {
      console.log('No tables found in the database.');
    } else {
      tables.forEach((table, index) => {
        console.log(`${index + 1}. ${table.tablename}`);
      });
      
      // Try to query a known table
      try {
        // Checking for Users table
        console.log('\n📊 Checking Users table...');
        const [userCount] = await sequelize.query('SELECT COUNT(*) as count FROM "Users"');
        console.log(`Number of rows in Users: ${userCount[0].count}`);
      } catch (error) {
        console.log('Users table might not exist or have a different name.');
        
        // Try Roles table
        try {
          console.log('\n📊 Checking Roles table...');
          const [roleCount] = await sequelize.query('SELECT COUNT(*) as count FROM "Roles"');
          console.log(`Number of rows in Roles: ${roleCount[0].count}`);
        } catch (error) {
          console.log('Roles table might not exist or have a different name.');
        }
      }
    }
    
    console.log('\n✨ Database connection test completed.');
  } catch (error) {
    console.error('❌ Unable to connect to the database or run queries:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection(); 