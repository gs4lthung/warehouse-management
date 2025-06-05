const { CREATED, OK } = require("../core/responses/success.response");
const AuthService = require("../services/auth.service");

class AuthController {
  signUp = async (req, res) => {
    new CREATED({
      message: "Sign up successfully",
      metadata: await AuthService.signUp(req.body),
    }).send(res);
  };

  logIn = async (req, res) => {
    new OK({
      message: "Log in successfully",
      metadata: await AuthService.logIn(req.body),
    }).send(res);
  };

  logInGoogle = async (req, res) => {
    new OK({
      message: "Log in with Google successfully",
      metadata: await AuthService.logInGoogle({ data: req.user._json }),
    }).send(res);
  };

  verifyEmail = async (req, res) => {
    new OK({
      message: "Email verified successfully",
      metadata: await AuthService.verifyEmail(req.query),
    }).send(res);
  }

  resetPassword = async (req, res) => {
    new OK({
      message: "Password reset successfully",
      metadata: await AuthService.resetPassword({ token: req.query.token, password: req.body.password })
    })
  }
}

module.exports = new AuthController();
