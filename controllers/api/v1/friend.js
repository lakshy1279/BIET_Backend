const User = require("../../../models/user");
const Friend = require("../../../models/friend");
module.exports.addfriend = async function (req, res) {
  try {
    console.log(req.user);
    let fromUser = await User.findById(req.query.user_id);
    let ToUser = await User.findById(req.user._id);
    console.log(fromUser);
    console.log(ToUser);
    let friend = await Friend.create({
      from_user: fromUser,
      to_user: ToUser,
    });
    fromUser.friend.push(friend._id);
    fromUser.save();
    ToUser.friend.push(friend._id);
    ToUser.save();
    ToUser = await ToUser.populate({
      path: "friend",
      populate: {
        path: "from_user",
      },
    }).execPopulate();
    return res.json(200, {
      message: "sucessful",
      success: true,
      data: {
        friendship: {
          to_user: {
            id: ToUser._id,
            email: ToUser.email,
            name: ToUser.name,
          },
          from_user: {
            id: fromUser._id,
            email: fromUser.email,
            name: fromUser.name,
          },
        },
      },
    });
  } catch (err) {
    console.log("error", err);
    return res.json(500, {
      message: "interval server error",
    });
  }
};
module.exports.friend = async function (req, res) {
  try {
    // console.log(req.user);
    let user = await User.findById(req.user._id);
    user = await user
      .populate({
        path: "friend",
        populate: {
          path: "to_user",
          select: "name email",
        },
      })
      .execPopulate();
    // user.friend.array.forEach(element => {

    // });
    // console.log(user);
    return res.json(200, {
      message: "List of friends",
      success: true,
      data: {
        friends: user.friend,
      },
    });
  } catch (err) {
    console.log("error", err);
    return res.json(500, {
      message: "interval server error",
    });
  }
};
module.exports.destroy = async function (req, res) {
  try {
    let user = await User.findById(req.user._id);
    user = await user
      .populate({
        path: "friend",
        populate: {
          path: "to_user",
          select: "name email",
        },
      })
      .execPopulate();
    var friendid;
    user.friend.forEach((element) => {
      if (element.to_user._id == req.query.user_id) {
        friendid = element._id;
      }
    });
    let fromUser = await User.findById(req.user._id);
    let ToUser = await User.findById(req.query.user_id);
    let friend = await Friend.findById(friendid);
    friend.remove();
    fromUser.friend.remove(friendid);
    ToUser.friend.remove(friendid);
    fromUser.save();
    ToUser.save();
    console.log(friendid);
    return res.status(200).json({
      success: true,
      message: "friends removed",
    });
  } catch (err) {
    console.log("error", err);
    return res.json(500, {
      message: "interval server error",
    });
  }
};
