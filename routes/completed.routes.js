const Completed = require('../models/Completed.model');
const User = require('../models/User.model')
const Post = require('../models/Post.model');


router.get('/completed', (req, res, next) => {
    User.find()
      .populate('postsCompleted')
      .then((response) => res.json(response))
      .catch((err) => next(err));
  });

module.exports = router;