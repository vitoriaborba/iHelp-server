const { Schema, model } = require("mongoose");

const postSchema = new Schema (
{
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    image: {
        type: String,
        /* required: true, */
        default: "https://www.morristourism.org/wp-content/uploads/2017/09/this-is-a-test-image.png"
    },
    description: {
        type: String,
        required: true,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
      },
      {
        timestamps: true,
    }

);

const Post = model("Post", postSchema);

module.exports = Post;