const knex = require('knex');
const app = require('../src/app');

const sentenceFixture = require('./fixtures/sentence-fixture');
const projectFixture = require('./fixtures/project-fixture');
const userFixture = require('./fixtures/user-fixture');

describe('sentence endpoint', () => {
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


  describe('GET /sentence', () => {
    //case of no sentences
    context('Given no sentences', () => {
      it('responds with an empty list and 200', () => {
        return supertest(app)
        .get('/sentence') 
        .expect(200, [])
      })
    })

    context('Given sentence(s) exist', () => {
      //insert test sentences
      beforeEach('insert user and projects and sentences', () => {
        return db
						.into('users')
						.insert(userFixture)
						.then(() => {
              return db.into('projects')
              .insert(projectFixture)
              .then(() => {
                return db.into('sentences')
                .insert(sentenceFixture)
              });
						});
      })
      //get the test sentences
      it('responds with 200 and the sentence(s)', () => {
        return supertest(app)
        .get('/sentence')
        .expect(200, sentenceFixture)
      })
    })

  })
})