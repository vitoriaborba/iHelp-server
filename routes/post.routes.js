const router = require("express").Router();

const User = require('../models/User.model')
const Post = require('../models/Post.model');


router.post('/post-create', (req, res, next) => {
    const {image, description, comments } = req.body;
              
    Post.create({ author:req.session.user._id, image, description, comments})
      .then((dbPost) => {
        const userId = req.session.user._id
        return User.findByIdAndUpdate(userId, { $push: { posts: dbPost._id } });
      })
      .then(() => res.json({message: "posted created"}))
      .catch((err) => next(err));
  });

  router.get('/feed', (req, res, next) => {
    User.find()
      .populate('posts')
      .then((response) => res.json(response))
      .catch((err) => next(err));
  });

  router.get('/feed/:postId', (req, res, next) => {
    const { postId } = req.params;
  
    Post.findById(postId)
    .then((response) => res.json(response))
    .catch((err) => next(err));
  });

  router.put('/feed/:postId', (req, res, next) => {
    const { postId } = req.params;
    const {description, isDone} = req.body

    Post.findByIdAndUpdate(postId, {description, isDone}, {new: true})
    .then((taskDone) => { 
      if(isDone === true) {
        return User.findByIdAndUpdate(taskDone.author, {$pull: {posts: postId}})
        .then((taskRemoved) => {
        User.findByIdAndUpdate(taskRemoved.author, {$push: {postsCompleted: postId}})
        })

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