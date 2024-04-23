const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
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
  },
  { timestamp: true }
);

// static signup function

userSchema.statics.signup = async (email, password) => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw Error("email already exist.!!");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await User.create({ email, password: hash });
  return user;
};

// Static login function
userSchema.statics.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw Error("email don't exist .!!");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Password not matching");
  }

  return user;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;