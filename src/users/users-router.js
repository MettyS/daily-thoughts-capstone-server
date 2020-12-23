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
      res.status(200).json(users);
    })
    .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    const { password, nickname } = req.body;
    const email = req.body.email.toLowerCase();
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
    if(passwordError) {
      console.log('password error: ', passwordError);
      return res.status(400).json({ error: {message: passwordError }});
    }

    const inputError = UsersService.validateEmailAndNicknameSyntax(email, nickname);
    if(inputError) {
      console.log('imput error: ', inputError);
      return res.status(400).json({error: {message: inputError}});
    }


    UsersService.validateEmailAndNickname(req.app.get('db'), email, nickname)
    .then(result => {
      console.log('EMAIL/nickname ERROR IS >>>>>>>>>>>>>> ', result);
      console.log('email/nickname error is a: ', typeof(result));
      if(result) {
        return res.status(400).json({ error: {message: result }});
      }

      console.log('MADE IT PAST VALIDATIONS!!');
    
    console.log('making password hash');
    UsersService.generatePasswordHash(password).then(hashedPassword => {
      const newUser = {
        nickname,
        email,
        password: hashedPassword
      };

    console.log('adding user');
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
    .catch( er => {
      console.log('>>>>>>ERROR ON 54 IS, ', er);
    })
    // console.log('returned emailerror is: ', emailError);
    // if(emailError){
    //   return res.status(400).json({ error: emailError });
    //   isEr = true;
    // }

    /*const nicknameError = UsersService.validateNickname(nickname);
    if(nicknameError) {
      res.status(400).json({ error: nicknameError })
      isEr = true;
      next();
    }*/
    
  })

usersRouter.route('/:user_id')
  .all( (req, res, next) => {
    const { user_id } = req.params;
    UsersService.getUserById(req.app.get('db'), user_id)
      .then(userWithId => {
        if(!userWithId) 
          return res.status(404).json({ error: {message: `User does not exist`} });
        
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