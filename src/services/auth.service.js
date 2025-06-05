const userModel = require("../models/user.model");
const {
  BadRequestError,
  UnauthorizedRequestError,
  InternalServerError,
} = require("../core/responses/error.response");
require("dotenv").config();
const bcrypt = require("bcrypt");
const CreateUserDto = require("../core/dtos/users/create.user.dto");
const { createAccessToken } = require("../utils/auth.util");
const { FILTER_USER, USER_ROLES } = require("../configs/user.config");
const { sendMail } = require("../utils/mailer");
const jwt = require("jsonwebtoken");
class AuthService {
  static signUp = async ({ fullName, email, password }) => {
    const createUserDto = new CreateUserDto(fullName, email, password);
    await createUserDto.validate();

    const userHolder = await userModel.findOne({ email }).lean();
    if (userHolder) throw new BadRequestError("Email already exists");

    const passwordHash = await bcrypt.hash(
      password,
      parseInt(process.env.PASSWORD_SALT)
    );

    const verifyToken = createAccessToken({ email: email },
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXPIRES);

    const newUser = await userModel.create({
      fullName,
      email,
      password: passwordHash,
      role: USER_ROLES.STAFF,
      // verifyToken: verifyToken,
    });

    return
  };

  static logIn = async ({ email, password }) => {
    if (!email || !password)
      throw new BadRequestError("Email and password are required");

    const userHolder = await userModel.findOne({ email, isDeleted: false }).lean();
    if (!userHolder) throw new UnauthorizedRequestError("Invalid email or password");

    const isPasswordMatch = await bcrypt.compare(password, userHolder.password);
    if (!isPasswordMatch)
      throw new UnauthorizedRequestError("Invalid email or password");

    const accessToken = createAccessToken(
      { _id: userHolder._id, role: userHolder.role },
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXPIRES
    );
    if (!accessToken) throw new InternalServerError("Server error");

    return accessToken;
  };

  static logInGoogle = async ({ data }) => {
    const userHolder = await userModel.findOne({ email: data.email }).lean();
    if (userHolder) {
      if (userHolder.isDeleted || !userHolder.isActive)
        throw new UnauthorizedRequestError("User is not active or deleted");
      if (!userHolder.isVerified)
        await userModel.updateOne({ email: data.email }, { isVerified: true, verifyToken: null });
      if (userHolder.avatar === null || userHolder.avatar === "")
        await userModel.updateOne({ email: data.email }, { avatar: data.picture || data.photo });

      const accessToken = createAccessToken(
        { _id: userHolder._id, role: userHolder.role },
        process.env.ACCESS_TOKEN_SECRET,
        process.env.ACCESS_TOKEN_EXPIRES
      );
      return accessToken;
    }
    const newUser = await userModel.create({
      fullName: data.name,
      email: data.email,
      password: await bcrypt.hash(data.email + data.fullName + data.picture + ROLES.STAFF + process.env.ACCESS_TOKEN_SECRET,
        parseInt(process.env.PASSWORD_SALT)),
      role: ROLES.STAFF,
      avatar: data.picture || data.photo,
      isVerified: true,
    })
    const accessToken = createAccessToken(
      { _id: newUser._id, role: newUser.role },
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXPIRES
    );
    if (!accessToken) throw new InternalServerError("Server error");
    return accessToken;
  }

  static verifyEmail = async ({ token }) => {
    if (!token) throw new BadRequestError("Invalid token");
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const decodedEmail = decodedToken.email;
    if (!decodedEmail) throw new BadRequestError("Invalid token");

    const userHolder = await userModel.findOne({ email: decodedEmail }).lean();
    if (!userHolder || userHolder.verifyToken !== token) throw new BadRequestError("Invalid token");
    if (userHolder.isVerified) throw new BadRequestError("Email already verified");

    await userModel.updateOne({ email: decodedEmail }, { isVerified: true, verifyToken: null });
    return
  }

  static createForgotPasswordRequest = async ({ email }) => {
    if (!email) throw new BadRequestError("Email is required");

    const userHolder = await userModel.findOne({ email }).find(FILTER_USER.NORMAL_USER).lean();
    if (!userHolder) throw new UnauthorizedRequestError("Invalid email");

    const resetToken = createAccessToken({ email: email },
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXPIRES);

    if (!resetToken) throw new InternalServerError("Server error");

    await userModel.updateOne({ email: email, }, {
      resetPasswordToken: resetToken,
    })
    
    return;
  }

  static resetPassword = async ({ token, newPassword }) => {
    if (!token || !newPassword) throw new BadRequestError("Invalid request");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const decodedEmail = decodedToken.email;
    if (!decodedEmail) throw new BadRequestError("Invalid token");

    const userHolder = await userModel.findOne({ email: decodedEmail }).lean();
    if (!userHolder || userHolder.resetPasswordToken !== token) throw new BadRequestError("Invalid token");

    const passwordHash = await bcrypt.hash(newPassword, parseInt(process.env.PASSWORD_SALT));
    await userModel.updateOne({ email: decodedEmail }, { password: passwordHash, resetPasswordToken: null });

    return;
  }
}


module.exports = AuthService;
