require('dotenv').config();

console.log(process.env)

module.exports = {
    "migrationDirectory": "migrations",
    "driver": "pg",
    // "host": "ec2-3-229-51-131.compute-1.amazonaws.com",
    // "port": process.env.MIGRATION_DB_PORT,
    // "database": process.env.MIGRATION_DB_NAME,
    // "username": process.env.MIGRATION_DB_USER,
    // "password": process.env.MIGRATION_DB_PASS,
    "connectionString": (process.env.NODE_ENV === 'test')
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL,
}
