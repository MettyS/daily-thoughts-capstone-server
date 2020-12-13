const express = require('express');
const AuthService = require('./auth-service');

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter.route('/login')
  .post(  jsonBodyParser, (req, res, next) => {

    const { nickname, password } = req.body;
    const loginUser = { nickname, password };

    for (const [key, value] of Object.entries(loginUser)){
      if (value == null){
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
      }
    }

    AuthService.getUserWithNickname(
        req.app.get('db'),
        loginUser.nickname
      )
      .then(dbUser => {
        console.log('dbUser:', dbUser)
        if (!dbUser)
          return res.status(400).json({
            error: 'Incorrect email or password',
          })
        return AuthService.comparePasswords(loginUser.password, dbUser.password)
          .then(isMatch => {
            console.log('password isMatch? : ', isMatch);
            if (!isMatch){
              return res.status(400).json({
                error: 'Incorrect nickname or password',
              })
            }
              
            const subject = dbUser.email;
            const payload = { user_id: dbUser.id };

            console.log("dbUser:", dbUser);
            console.log('subject:', subject);
            console.log("payload:", payload);

            res.send({
              authToken: AuthService.createJwt(subject, payload),
              userId: dbUser.id
            });
          })
      })
      .catch(next);
  })

module.exports = authRouter;