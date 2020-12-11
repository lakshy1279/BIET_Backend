const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user || user.password != req.body.password) {
      return res.json(422, {
        message: "Invalid username or password",
      });
    }

    return res.json(200, {
      data: {
        token: jwt.sign(user.toJSON(), env.jwt_secret),
        user: {
          name: user.name,
          email: user.email,
          id: user._id,
        },
      },
      success: true,
      message: "sign in Successfully here is your token keep it safe!",
    });
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: "internal server error",
    });
  }
};
module.exports.update = async function (req, res) {
  try {
    console.log(req.params.id);
    let user = await User.findById(req.params.id);
    User.uploadedAvatar(req, res, function (err) {
      if (err) {
        console.log("******Multer Error", err);
      }
      console.log(user);
      // user.update(req.body);
      user.name = req.body.name;
      user.email = req.body.email;
      user.skills = req.body.skills;
      console.log(req.file);
      if (req.file) {
        if (user.avatar) {
          if (fs.existsSync(path.join(__dirname, "../../../", user.avatar))) {
            fs.unlinkSync(path.join(__dirname, "../../../", user.avatar));
          }
        }

        //this is saving path of the uploaded file into the user avatr
        user.avatar = User.avatarpath + "/" + req.file.filename;
      }
      user.save();
      return res.json(200, {
        message: "user updated successfuly",
        success: true,
        data: {
          user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            skills: user.skills,
          },
        },
      });
    });
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: "internal server error",
    });
  }
};
module.exports.getUsers = async function (req, res) {
  try {
    console.log(req.query.admin);
    let users = await User.find({ aluminia: req.query.admin });
    console.log(users);
    if (!users) {
      return res.json(422, {
        message: "No user exist with given data",
      });
    }
    return res.json(200, {
      message: "Sign up successful, user created",
      success: true,
      data: {
        user: users,
      },
    });
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: "internal server error",
    });
  }
};
module.exports.create = async function (req, res) {
  try {
    console.log("enter");
    console.log(JSON.stringify(req.headers));
    if (req.body.password != req.body.confirm_password) {
      return res.json(422, {
        message: "password not matched",
      });
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.json(422, {
        message: "user already exist",
      });
    }
    let newUser = await User.create(req.body);
    console.log(newUser);
    return res.json(200, {
      message: "Sign up successful, user created",
      success: true,
      data: {
        token: jwt.sign(newUser.toJSON(), "biet"),
        user: {
          name: newUser.name,
          email: newUser.email,
          _id: newUser._id,
        },
      },
    });
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: "internal server error",
    });
  }
};
