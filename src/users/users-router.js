const express = require('express');
const path = require('path'); 

const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonParser = express.json();


usersRouter.route('/')
  .get((req, res, next) => {
    UsersService.getUsers(req.app.get('db'))
    .then(users => {
      console.log('All users: ', users);
      res.json(users);
    })
    .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    const { email, password, nickname } = req.body;
    console.log(email, password, nickname);

    //check if there's a missing field
    for( const field of ['email', 'password', 'nickname']) {
      if(!req.body[field]){
        return res.status(400)
                  .json({
                    error: `Missing ${field} in request body`
                  });
      }
    }
    //check that the fields are valid
    const passwordError = UsersService.validatePassword(password);
    if(passwordError)
      return res.status(400).json({ error: passwordError })

    const emailError = UsersService.validateEmail(req.app.get('db'), email);
    console.log('EMAIL ERROR IS >>>>>>>>>>>>>> ', emailError)
    if(emailError)
      return res.status(400).json({ error: emailError })

    const nicknameError = UsersService.validateNickname(nickname);
    if(nicknameError)
      return res.status(400).json({ error: nicknameError })

    console.log('MADE IT PAST VALIDATIONS!!');
    
    UsersService.generatePasswordHash(password).then(hashedPassword => {
      const newUser = {
        nickname,
        email,
        password: hashedPassword
      };

      UsersService.addUser(req.app.get('db'), newUser)
        .then(addedUser => {
          console.log("the added user is: ", addedUser);
          res.status(201)
            .location(path.posix.join(req.originalUrl, `/${addedUser.id}`))
            .json(UsersService.serializeUser(addedUser));
        })
        .catch(next);
    })
    
  })

usersRouter.route('/:user_id')
  .all( (req, res, next) => {
    const { user_id } = req.params;
    UsersService.getUserById(req.app.get('db'), user_id)
      .then(userWithId => {
        if(!userWithId) 
          return res.status(404).json({ error: {message: `User does not exist`} })
        
        res.user = userWithId;
        next();
      })
      .catch(next);
  })
  .get( (req, res) => {
    res.json(UsersService.serializeUser(res.user));
  })
  .delete( (req, res, next) => {
    console.log('not allowed to delete users, do this manually!');
    // const user_id = res.user.id;

    // UsersService.deleteUser(req.app.get('db'), user_id)
    //   .then(rows => {
    //     console.log('num deleted: ', rows);
    //     res.status(204).end();
    //   })
    //   .catch(next);
  })


module.exports = usersRouter;