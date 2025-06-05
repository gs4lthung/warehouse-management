const express = require("express");
const authController = require("../controllers/auth.controller");
const { catchAsyncHandle } = require("../middlewares/error.middleware");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

const router = express.Router();

router.post("/signup",
    /**
     * #swagger.tags = ['Auth']
     * #swagger.description='Sign up new user'
     */
    /*  #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Signup"
                }  
            }
        }
    } 
*/
    catchAsyncHandle(authController.signUp));

router.post(
    "/login",
    /**
     * #swagger.tags = ['Auth']
     * #swagger.description='Log in user'
     */
    /*  #swagger.requestBody = {
          content: {
              "application/json": {
                  schema: {
                      $ref: "#/components/schemas/Login"
                  }  
              }
          }
      } 
  */
    catchAsyncHandle(authController.logIn)
);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_OUATH_REDIRECT_URL
}, async (accessToken, refreshToken, profile, done) => {
    return done(null, profile)
}))
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

router.use(passport.initialize());
router.use(passport.session());
router.get("/login/google",
    /**
     * #swagger.tags = ['Auth']
     * #swagger.description='Log in user with Google: http://domain/api/v1/auth/login/google'
     */
    passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get("/login/google/callback",
    /**
     * #swagger.tags = ['Auth']
     * #swagger.description='Log in user with Google callback'
     */
    passport.authenticate("google", { failureRedirect: "/" }),
    catchAsyncHandle(authController.logInGoogle)
)

router.get("/verify/email",
    /**
     * #swagger.tags = ['Auth']
     * #swagger.description='Verify user email'
     */
    /*  #swagger.parameters['token'] = {
        in: 'query',
        required: true,
        type: 'string'
    }
    */
    catchAsyncHandle(authController.verifyEmail)
)

router.post("/reset/password",
    /**
     * #swagger.tags = ['Auth']
     * #swagger.description='Reset user password'
     */
    /*
    #swagger.parameters['token'] = {
        in: 'query',
        required: true,
        type: 'string'
    }
    #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ResetPassword"
                }
            }
        }
    }
    */
    catchAsyncHandle(authController.resetPassword)
)
module.exports = router;