const router = require("express").Router();

const User = require('../models/User.model');
const Post = require('../models/Post.model');
const Comment = require('../models/Comment.model');

router.post('/comment/:postId', (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;

      Post.findById(postId)
      .then(()=>{
          Comment.create({author:req.session.user._id, postId, content})
          .then((dbComment) => {
            return Post.findByIdAndUpdate(postId, { $push: { comments: dbComment._id } });
          })
          .then((response) => res.json(response))
           .catch((err) => next(err));
      });
})

router.delete('/post/:commentId', (req, res, next) => {
    const {commentId} = req.params;

    Comment.findByIdAndRemove(commentId)
    .then((deletedComment) => {
      console.log(deletedComment)
        return Post.findByIdAndUpdate(deletedComment.post, {$pull: {comments: commentId}})
        .then(() => res.json({message: `Comment with ${commentId} was removed sucessfully`}));
    })
    .catch((err) => res.json(err))
});

module.exports = router;