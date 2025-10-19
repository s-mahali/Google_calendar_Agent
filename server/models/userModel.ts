import mongoose from "mongoose";
import jwt from "jsonwebtoken"

interface IUser {
  email: string;
  username: string;
  refreshToken: string;
}

interface IUserMethods {
  generateToken: () => string;
}

// Explicit model type including instance methods
type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "10d" }
  );
};

const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
