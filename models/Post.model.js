const { Schema, model } = require("mongoose");

const postSchema = new Schema (
{
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    image: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    isDone: {
        type: Boolean,
        default: false,
    },
    
      },
      {
        timestamps: true,
    }
);

const Post = model("Post", postSchema);

module.exports = Post;