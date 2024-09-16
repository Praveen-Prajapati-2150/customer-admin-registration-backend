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
//       ssl: { rejectUnauthorized: false }, 
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
      connectionString: process.env.DATABASE_URL, 
      ssl: { rejectUnauthorized: false }, 
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};

