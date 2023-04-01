const { mongoose, Schema } = require("mongoose");
4;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username cannot be blank"],
    },
    email: {
      type: String,
      unique: [true, "Email needs to be unique"],
      required: [true, "Email cannot be blank"],
    },
    password: {
      type: String,
      minLength: [5, "Password length cannot be less than 5 characters"],
      required: [true, "Password cannot be blank"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  return (this.password = await bcrypt.hash(this.password, 10));
});

module.exports = mongoose.model("users", userSchema);
