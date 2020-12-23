require('dotenv').config();

console.log(process.env)
listen_addresses = '*';

module.exports = {
    "migrationDirectory": "migrations",
    "driver": "pg",
    
    /*"host": "ec2-3-229-51-131.compute-1.amazonaws.com",
    "port": "5432",
    "database": "dd4dedtad81qm7",
    "username": "rpyvwbqkfpwbgd",
    "password": "b1bbf82f01bb5f4e27f8e3c9cb1a25e0ce094ace4be3f8940e8e01df5efe37d1",*/
    "connectionString": (process.env.NODE_ENV === 'test')
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL
}
