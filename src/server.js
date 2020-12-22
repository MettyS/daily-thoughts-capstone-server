require('dotenv').config()
const app = require('./app')
const {
    PORT,
    DATABASE_URL
} = require('./config')

console.log(`PORT IS: ${PORT}`);
console.log(`DATABASE_URL IS: ${DATABASE_URL}`);

const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: DATABASE_URL
})

app.set('db', db)

app.listen(PORT, () => {
    console.log(`Server listening at ${DATABASE_URL}:${PORT}`)
})
