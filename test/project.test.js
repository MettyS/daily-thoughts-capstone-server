const knex = require('knex');
const app = require('../src/app');

const projectFixture = require('./fixtures/project-fixture');
const userFixture = require('./fixtures/user-fixture');

describe('project endpoint', () => {
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


  describe('GET /project', () => {
    //case of no projects
    context('Given no projects', () => {
      it('responds with an empty list and 200', () => {
        return supertest(app)
        .get('/project') 
        .expect(200, [])
      })
    })

    context('Given project(s) exist', () => {
      //insert test projects
      beforeEach('insert user and projects', () => {
        return db
						.into('users')
						.insert(userFixture)
						.then(() => {
							return db.into('projects').insert(projectFixture);
						});
      })
      //get the test projects
      it('responds with 200 and the project(s)', () => {
        return supertest(app)
        .get('/project')
        .expect(200, projectFixture)
      })
    })

  })
})