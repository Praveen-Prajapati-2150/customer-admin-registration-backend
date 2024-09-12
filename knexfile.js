// knexfile.js
require('dotenv').config();

// module.exports = {
//   development: {
//     client: 'pg',
//     connection: {
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASS,
//       database: process.env.DB_NAME,
//       port: process.env.DB_PORT,
//       ssl: { rejectUnauthorized: false }, // Required for Render.com SSL connection
//     },
//     migrations: {
//       tableName: 'knex_migrations',
//     },
//   },
// };

module.exports = {
  development: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL, // Use the full connection string
      ssl: { rejectUnauthorized: false }, // Enable SSL with relaxed security
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};

