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

// List of tables to check
const tables = [
  'Roles',
  'Users',
  'Folders',
  'Sets',
  'Cards',
  'UserSessions',
  'UserProgresses',
  'Images'
];

async function checkTables() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL database!\n');
    
    console.log('📊 Number of records in each table:');
    console.log('----------------------------------');
    
    for (const table of tables) {
      try {
        const [result] = await sequelize.query(`SELECT COUNT(*) FROM "${table}"`);
        // console.log(`${table}: ${result[0].count} records`);
      } catch (error) {
        console.log(`${table}: Error - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

checkTables(); 