const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const auth = require("./auth.js");


const users = require("./users.js");
const User = users.model;

const photos = require("./photos.js");
const Photo = photos.model;

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  photo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Photo'
  },
  commentText: String,
  created: {
    type: Date,
    default: Date.now
  },
});

const Comment = mongoose.model('Comment', commentSchema);

router.post('/', auth.verifyToken, User.verify, async (request, response) => {
  console.log("Trying to make a new comment!");
  try {
    let newComment = new Comment({
      user: request.body.user_id,
      photo: request.body.photo_id,
      commentText: request.body.commentText
    });
    await newComment.save();
    return response.sendStatus(200);
  } catch (error) {
    console.log(error);
    response.sendStatus(500);
  }
});

// router.get('/:photoID', auth.verifyToken, User.verify, async (request, response) => { //So, for some reason, params is undefined. Pretty sure it doesn't have to do with middleware
router.get('/list:photoID', async (request, response) => {
  console.log("Grabbing the comments!");
  console.log("Request parameters:");
  console.log(request.params);
  try {
    let photo = await Photo.find({
      _id: request.params.photoID
    });
    console.log("We found a photo with the id: " + request.params.photoID);
    let comments = await Comment.find({
      photo: photo //It seems like this should be an object, not id
    }).sort({ //Sort the comments in descending order by created date
      created: -1
    }).populate('user'); //Fill in the references to the user schema with the actual object
    return response.send(comments);
  } catch (error) {
    console.log(error);
    return response.sendStatus(500);
  }
});

module.exports = {
  mode: Comment,
  routes: router,
}