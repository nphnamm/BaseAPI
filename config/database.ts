import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Determine which .env file to load
const ENV_FILE = process.env.ENV_FILE || ".env.postgres";
dotenv.config({ path: ENV_FILE });
console.log(`Loaded environment file: ${ENV_FILE}`); // Debugging

// Database settings from .env
const DB_URL = process.env.DB_URL || "";
const DB_DIALECT = (process.env.DB_DIALECT || "postgres") as "postgres" | "mssql";
const DB_SSL = process.env.DB_SSL === "true"; // Use SSL if specified in .env
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 1433;
const DB_NAME = process.env.DB_NAME || "QuizLearn";
const DB_USER = process.env.DB_USER || "nphnamm";
const DB_PASS = process.env.DB_PASS || "0977187016nam";

let sequelize: Sequelize;
if (DB_URL) {
  sequelize = new Sequelize(DB_URL, {
    dialect: DB_DIALECT,
    logging: false,
    dialectOptions:
      DB_DIALECT === "postgres" && DB_SSL
        ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
        : DB_DIALECT === "mssql"
          ? {
            options: {
              encrypt: false, // Set to true if SQL Server requires encryption
              enableArithAbort: false,
            },
          }
          : {},
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: false,
    },
  });


} else {
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: parseInt(DB_PORT as string),
    dialect: "mssql",
    logging: false,
  }); 
}
// Sequelize configuration based on dialect


// Define interface for the database object
interface DbInterface {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  [key: string]: any; // Allow dynamic properties
}

const db: DbInterface = {
  sequelize,
  Sequelize,
};

export default db;