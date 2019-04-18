const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const auth = require("./auth.js");
// const multer = require('multer');
// const upload = multer({
//   dest: '../public/images',
//   limits {
//     filesize: 10000000
//   }
// });

const SALT_WORK_FACTOR = 10; //The number of times the password will be salted

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  tokens: [], //This is a list of (one for each browser they're logged in on)
  // imagePath: String,
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) { //Only salt/hash the password if the password is modified or new
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR); //Tell bcrypt to create a salt with our 10 time epicness
    const hash = await bcrypt.hash(this.password, salt); //Hash our plaintext password with the salt
    this.password = hash; //Set the password according to the returned salt
    next();
  } catch (error) {
    console.log(error);
    next(error); //We call the next function as pass it our error
  }
});

userSchema.methods.comparePassword = async function(password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password); //Compares the passed in, plaintext password with the hashed password in the database
    return isMatch; //true if they match, false otherwise
  } catch (error) {
    return false; //There was some kind of error, so they don't match
  }
};

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password; //Strip out the secret stuff, of course.
  delete obj.tokens;
  return obj;
}

userSchema.methods.addToken = function(token) {
  this.tokens.push(token);
}

userSchema.methods.removeToken = function(token) {
  this.tokens = this.tokens.filter(t => t != token); //Filter it down to all the tokens that aren't the token that we pass in
}

userSchema.methods.removeOldTokens = function() {
  this.tokens = auth.removeOldTokens(this.tokens);
}

userSchema.statics.verify = async function(request, response, next) { //This is a static method, which means that all instances of this schema will share this method. This will be middleware that validates a user's account
  // console.log(request.user_id);
  // console.log("We are now verifying the user!");
  const user = await User.findOne({
    _id: request.user_id
  });
  if (!user || !user.tokens.includes(request.token)) { //If the user couldn't be found, or the user tokens list doesn't include the token in the cookie they sent over
    return response.clearCooke('token').status(403).send({
      error: "Invalid user account."
    });
  }
  request.user = user;
  next();
}

const User = mongoose.model('User', userSchema); //Tell Mongoose to compile a model for us. .model("Singular", schema). Mongoose automatically looks for the plural, lowercased version of the "Singular" model name. An instance of this model is called a document
//We can now call User.create or User.insertMany to insert documents into this model


router.post('/', async (request, response) => { //Endpoint to create a new user
  // console.log("Beginning to register a user.");
  if (!request.body.username || !request.body.password) {
    return response.status(400).send({
      message: "Username and Password are required!"
    });
  }

  try {
    //We check to see if this username already exists
    const existingUser = await User.findOne({
      username: request.body.username,
    });
    if (existingUser) {
      // console.log("The user that you tried to log in already exists!");
      return response.status(403).send({
        message: "That username already exists!"
      });
    }

    //If we've made it this far, it's time to create a new user.
    const user = new User({
      username: request.body.username,
      password: request.body.password,
    });
    await user.save(); //Save this new document in the database. Remember that before it's saved, it will run through the .pre() function above which salts and hashes the password
    // console.log("We just made a new user!");
    login(user, response);
  } catch (error) {
    console.log(error);
    return response.sendStatus(500); //We couldn't create a new user!
  }
});

router.post('/login', async (req, res) => { //The login endpoint is very similar to the register endpoint, however it doesn't create a new user and has to check if the password is correct
  if (!req.body.username || !req.body.password)
    return res.status(400).send({
      message: "Username and password are required."
    });

  try {
    //  lookup user record
    const existingUser = await User.findOne({
      username: req.body.username
    });
    if (!existingUser)
      return res.status(403).send({
        message: "The username or password is wrong."
      });

    // check password
    if (!await existingUser.comparePassword(req.body.password))
      return res.status(403).send({
        message: "The username or password is wrong."
      });

    login(existingUser, res);

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

async function login(user, response) { //When we log in the user, we create a new token and then give it to that user in the database
  let token = auth.generateToken({
    id: user._id
  }, "24h");

  user.removeOldTokens();
  user.addToken(token);
  await user.save();

  return response.cookie("token", token, {
    expires: new Date(Date.now() + 86000 * 1000) //Although we've told it that the token will expire in 24 hours, we also let the browser know that the cookie will also expire in 24 hours
  }).status(200).send(user);
}

router.delete('/', auth.verifyToken, User.verify, async (request, response) => { //It says delete, but what it's really doing is logging a user out
  request.user.removeToken(request.token); //Get rid of the token that would otherwise automatically log them in
  await request.user.save(); //Note that the User.verify middleware sets request.user to be the actual user in the database. This is why we can perform all these operations on request.user
  // console.log("logging out!");
  response.clearCookie('token');
  response.sendStatus(200);
});

router.get('/', auth.verifyToken, User.verify, async (request, response) => { //This gets the current user if they're logged in
  // console.log("We are nabbing the users!");
  return response.send(request.user); //Returns the user (which is in the request object after going through the User.verify middleware)
});

module.exports = { //When another file says .require('users.js'), they can also do .model or .routes on whatever they set equal to that require statement
  model: User,
  routes: router,
};