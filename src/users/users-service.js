const xss = require('xss');

const bcrypt = require('bcryptjs');

const UsersService = {
  serializeUser(user) {
    return {
      id: user.id,
      nickname: xss(user.nickname),
      email: xss(user.email),
      date_created: user.date_created
    }
  },
  getUsers(db) {
    return db('users')
      .select('*');
  },
  addUser(db, user) {
    return db('users')
      .insert(user)
      .returning('*')
      .then( ([addedUser]) => addedUser);
  },
  deleteUser(db, id) {
    return db('users')
      .where({ id })
      .delete()
  },
  //getUsersByDate(db, date) {},
  //getUsersByName(db, name) {},
  getUserById(db, userId) {
    return db('users')
      .select('*')
      .where('id', userId)
      .first();
  },
  getUsersByEmail(db, email) {
    return db('users')
      .select('*')
      .where({ email })
      .first();
  },


  validateEmail(db, email) {
    // must be unique
    this.getUsersByEmail(db, email)
    .then(user => {
      console.log('user is: ', user);
      if(user.id){
        return 'Email or username are already in use';
      }
      return false;
    })
    //console.log(this.getUsersByEmail(db, email).then(res => this.serializeUser(res)))
    //return this.getUsersByEmail(db, email).then(res => this.serializeUser(res)) ? 'Email or username are already in use': null;
    //return null;
  },
  validatePassword(password) {
    // at least 8 chars, 
    // at least one alpha and one special character
    return null;
  },
  validateNickname(nickname) {
    // minimum 5 characters, 
    // no special chars, 
    // no initial/trailing space 
    return null;
  },
  generatePasswordHash(password) {
    return bcrypt.hash(password, 8);
  }
  
  };
  
  module.exports = UsersService;