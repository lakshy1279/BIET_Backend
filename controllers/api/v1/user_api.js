const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
module.exports.createSession = async function (req, res) {
  try {
    console.log(req.body);
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
        admin: users,
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
