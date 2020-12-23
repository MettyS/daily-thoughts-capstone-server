const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const userFixture = require('./fixtures/user-fixture');

describe('user endpoint', () => {
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  })

  before('cleanup', () => db.raw('TRUNCATE TABLE sentences, projects, users RESTART IDENTITY;'));
  afterEach('cleanup', () => db.raw('TRUNCATE TABLE sentences, projects, users RESTART IDENTITY;'));
  after('destroy connection', () => db.destroy());


  describe('GET /users', () => {
    //case of no users
    context('Given no users', () => {
      it('responds with an empty list and 200', () => {
        return supertest(app)
        .get('/users') 
        .expect(200, [])
      })
    })

    context('Given there are user(s)', () => {
      //insert test user
      beforeEach('insert user', () => {
        return db.into('users').insert(userFixture)
      })
      //get the test user
      it('responds with 200 and the user(s)', () => {
        return supertest(app)
        .get('/users')
        .expect(200, userFixture)
      })
    })

  })
})