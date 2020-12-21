require('dotenv').config()
const app = require('./src/app')
const {
    PORT,
    DATABASE_URL
} = require('./src/config')
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: DATABASE_URL
})

app.set('db', db)

app.listen(PORT, () => {
    console.log(`Server listening at ${DATABASE_URL}:${PORT}`)
})
