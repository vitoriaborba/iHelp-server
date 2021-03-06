const router = require("express").Router();
const Post = require('../models/Post.model');
const Comment = require('../models/Comment.model');

router.post('/comment/:postId', (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;
  const {_id } = req.payload;

          Comment.create({author:_id, post:postId, content})
          .then((dbComment) => {
            return Post.findByIdAndUpdate(postId, { $push: { comments: dbComment._id } });
          })
          .then((response) => res.json(response))
           .catch((err) => next(err));
})

router.delete('/post/:commentId', (req, res, next) => {
    const {commentId} = req.params

    Comment.findByIdAndRemove(commentId)
    .then((deletedComment) => {
      console.log(deletedComment)
        return Post.findByIdAndUpdate(deletedComment.post, {$pull: {comments: commentId}})
        .then(() => res.json({message: `Comment with ${commentId} was removed sucessfully`}));
    })
    .catch((err) => res.json(err))
});

module.exports = router;