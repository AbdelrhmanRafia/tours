const crypto = require("node:crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    role: {
      type: String,
      enum: ["user", "guide", "lead-guide", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return;
  // Hash the password with cost of 12
  this.password = await bcryptjs.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return;

  this.passwordChangedAt = Date.now() - 1000;
});

userSchema.methods.isPasswordCorrect = async function (
  userPassword,
  candidatePassword,
) {
  return await bcryptjs.compare(userPassword, candidatePassword);
};

userSchema.methods.passwordChangeAfter = function (JWTTimestamp) {
  // if the user is new and password didn't change
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
module.exports = mongoose.model("User", userSchema);
