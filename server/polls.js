const mongoose = require("mongoose");
const express = require("express");
const router = express.Router(); //We need a router to rout all our api request!
const auth = require("./auth.js");
const users = require("./users.js");
const User = users.model;

//Uncomment the comment schema when we are ready to implement comments.
/*
const commentSchema = new mongoose.Schema({
  username: String,
  commentText: String,
  date: Date,
});
*/
const voteSchema = new mongoose.Schema({
  // user: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'User'
  // },
  username: String, //Perhaps this is bad practice, but we do verify that each user's username is unique
  index: Number
});

const pollSchema = new mongoose.Schema({ //Maps to a MongDB collection
  user: { //Notice that we can convert any of these "single" methods into an object wher it has a type, required, ref, default value, etc.
    type: mongoose.Schema.ObjectId,
    ref: 'User' //Tells Mongoose which model to use during population. The above id must be an _id from the User model
  },
  questionText: String,
  date: Date, //We could store this as a Date object, but we're already sending the date over as a string... IDK what's better practice, we can change this later.
  optionsText: [String], //This is how the stuff will be stored in the database, but when it's converted to JSON, it'll get slammed back into one object.
  optionsVotes: [Number],
  userVotes: [voteSchema]
  //comments: [commentSchema] //Go ahead and implement this once we get comments working.
});

const Poll = mongoose.model('Poll', pollSchema); //We have to convert the schema into a model in order to begin working with it. Instances of this model become documents

router.get("/", async (request, response) => { //Again, we don't have to use "/api/polls," because we already specified that server.js will only refer to polls.js if they receive a request srating with /api.polls
  try {
    let polls = await Poll.find().sort({
      date: -1
    }).populate('user'); //Note! We will modify this to only grab polls that are in your list of friends!
    return response.send(polls);
  } catch (error) {
    console.log(error); //Oh no! We couldn't get all the polls from the database!
  }
});

router.post("/", auth.verifyToken, User.verify, async (request, response) => {
  const poll = new Poll({
    user: request.user, //Provided to us by the User.verify middleware, I believe
    questionText: request.body.questionText,
    date: new Date(),
    optionsText: request.body.optionsText, //I hope you see the importance of keeping these two arrays in sync!
    optionsVotes: request.body.optionsText.map(option => 0) //For each option in the optionsText, initialize the vote to zero.
  });
  try {
    await poll.save(); //Try to save this in the database as a new document
    return response.send(poll); //Send back the poll!
  } catch (error) {
    console.log(error);
    return response.sendStatus(500); //Something really bad happened! We can't save to our server!
  }
});

router.put("/:id", auth.verifyToken, User.verify, async (request, response) => {
  console.log(request.user.username + " is trying to vote.");
  console.log("Here is the object they are voting on:");
  try {
    // await Poll.updateOne({
    //   _id: request.params.id,
    // }, {
    //   optionsVotes: request.body.optionsVotes,
    // });
    poll = await Poll.findOne({
      _id: request.params.id,
    });
    console.log(poll);

    let alreadyVoted = false;
    poll.userVotes.forEach(async vote => {
      if (vote.username === request.user.username) {
        alreadyVoted = true;
        if (vote.index === request.body.index) {
          console.log("You already voted there!");
          return response.status(403).send({
            message: "You already voted for that option!",
          });
        } else {
          console.log("Changing your vote!");
          let newOptions = [];
          poll.optionsVotes.forEach((voteNumber, currentIndex) => {
            if (currentIndex === vote.index) {
              newOptions.push(voteNumber - 1);
            } else if (currentIndex === request.body.index) {
              newOptions.push(voteNumber + 1);
            } else {
              newOptions.push(voteNumber);
            }
          });
          poll.optionsVotes = newOptions;
          vote.index = request.body.index;
          try {
            await poll.save();
            return response.status(200).send({
              message: "Successfully changed your vote!",
            });
          } catch (error) {
            console.log("COULDN'T SAVE THE POLL!!!!");
          }
        }
      }
    });
    if (!alreadyVoted) {
      poll.userVotes.push({
        username: request.user.username,
        index: request.body.index
      });
      poll.optionsVotes = request.body.optionsVotes;
    }

    try {
      await poll.save();
      response.status(200).send({
        message: "Your vote has been noted!",
      });
    } catch (error) {
      console.log("APPARENTLY WE DON'T SAVE POLLS AROUND HERE.");
    }

    //Extra expirimental junk:
    //Below is a proposed more efficient solution
    // const pollToUpdate = await Poll.findOne({
    //   _id: request.params.id
    // });
    // console.log(pollToUpdate.username);
    // pollToUpdate.optionsVotes.(request.body.index) = request.body.newValue;
    // console.log("We did it!");
    // await pollToUpdate.save();
    // response.sendStatus(200);
  } catch (error) {
    console.log("Couldn't update the vote count on the object!");
    console.log(error);
    response.sendStatus(500);
  }
});

router.delete("/:id", auth.verifyToken, User.verify, async (request, response) => {
  try {
    await Poll.deleteOne({
      _id: request.params.id
    }, error => {
      if (!error) {
        console.log(error);
      }
    });
    // try {
    //   poll = await Poll.find({
    //     _id: request.params.id,
    //   }).populate('user');
    //   if (request.user.username !== poll.user.username) {
    //     return response.sendStatus(403); //Forbidden
    //   }
    //   await poll.remove();
    response.sendStatus(200); //Hooray, we deleted it!
  } catch (error) {
    console.log("Couldn't delete the object!");
    console.log(error);
    response.sendStatus(500);
  }
});

module.exports = router; //When we say require("/polls.js") in server.js, we are pulling in this router object!