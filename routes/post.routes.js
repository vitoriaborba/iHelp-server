const router = require("express").Router();

const User = require('../models/User.model')
const Post = require('../models/Post.model');
const fileUploader = require("../config/cloudinary.config");

router.post("/upload", fileUploader.single("image"), (req, res, next) => {
  // console.log("file is: ", req.file)
 
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  
  res.json({ fileUrl: req.file.path });
});

router.post('/post-create', (req, res, next) => {
    const {location, description, image, comments } = req.body;
    const {_id } = req.payload;
 
    Post.create({ author:_id, image, location, description, comments})
      .then((dbPost) => {
  
        return User.findByIdAndUpdate(_id, { $push: { posts: dbPost._id } });
      })
      .then(() => res.json({message: "posted created"}))
      .catch((err) => next(err));
  });

  router.get('/feed', (req, res, next) => {
    Post.find({isDone:false})
      .populate('author')
      .then((response) => res.json(response))
      .catch((err) => next(err));
  });

  router.get('/requests/:userId', (req, res, next) => {
    const {userId} = req.params;
    User.findById(userId)
      .populate('posts postsCompleted')
      .then((response) => {
        console.log(response)
        res.json(response)
      })
      .catch((err) => next(err));
  });

  router.get('/feed/:postId', (req, res, next) => {
    const { postId } = req.params;
  
    Post.findById(postId)
    .populate('author comments')
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
        model: 'User',
      },
    })
    .then((response) => res.json(response))
    .catch((err) => next(err));
  });

  router.put('/feed/:postId', (req, res, next) => {
    const { postId } = req.params;
    const {description, isDone} = req.body

    Post.findByIdAndUpdate(postId, {description, isDone}, {new: true})
    .then((taskDone) => { 
      if(taskDone.isDone === true) {
        return User.findByIdAndUpdate(taskDone.author, {$pull: {posts: postId}, $push: {postsCompleted: taskDone._id}})
      }else{
        return User.findByIdAndUpdate(taskDone.author, {$push: {posts: postId}, $pull: {postsCompleted: taskDone._id}})
      }

    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err))
});

  router.delete('/feed/:postId', (req, res, next) => {
    const { postId } = req.params;

    Post.findByIdAndRemove(postId)
    .then((deletedPost) => {
        console.log(deletedPost)
        return User.findByIdAndUpdate(deletedPost.author, {$pull: {posts: postId}})
        .then(() => res.json({message: `Comment with ${postId} was removed sucessfully`}));
    })
    .catch((err) => res.json(err))
});
   

module.exports = router;