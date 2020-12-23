//Mongoose models allow us to access data from MongoDB in an object-oriented fashion.
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const Avatr_Path = path.join("uploads/users/avatrs");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    friend: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Friendship",
      },
    ],
    avatar: {
      type: String,
    },
    aluminia: {
      type: Boolean,
    },
    year: {
      type: Number,
      default: 0,
    },
    skills: [
      {
        type: String,
      },
    ],
  },
  {
    //The {timestamps: true} option creates a createdAt and updatedAt field on our models that contain timestamps which will get automatically updated when our model changes.
    timestamps: true,
  }
);
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", Avatr_Path));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

//static methods
userSchema.statics.uploadedAvatar = multer({ storage: storage }).single(
  "avatar"
);
userSchema.statics.avatarpath = Avatr_Path;
const User = mongoose.model("User", userSchema);
module.exports = User;
