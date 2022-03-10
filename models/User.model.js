const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
{
  username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
  },
  email: {
      type: String, 
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
  },
  image: {
      type: String,
      default: "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
  },
   password: {
    type: String,
    required: true,
    trim: true,
   },
   posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
   postsCompleted: [{ type: Schema.Types.ObjectId, ref: 'Completed' }],
   wasHelped: [{ type: Schema.Types.ObjectId, ref: 'User' }],
   Helped: [{ type: Schema.Types.ObjectId, ref: 'User' }],
},
  
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
