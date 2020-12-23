require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');
const projectRouter = require('./project/project-router');
const sentenceRouter = require('./sentence/sentence-router');

const { NODE_ENV } = require('./config');
const errorHandler = require('./middleware/error-handler');
const pancakeRouter = require('./pancake/pancake-router');

const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption, {
    skip: () => NODE_ENV === 'test',
}));
app.use(cors());
app.use(helmet());

app.use(express.static('public'));

app.get('/', (req, res,) => {
    console.log('entering app.get');
    res.send('Hello, world!')
});

app.use('/pancakes', pancakeRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/project', projectRouter);
app.use('/sentence', sentenceRouter);

//app.use(errorHandler);
app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response);
});

module.exports = app;
