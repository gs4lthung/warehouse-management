require("dotenv").config();

const AUTHENTICATION = {
    swagger: {
        users: { admin: process.env.SWAGGER_AUTH_PASSWORD }
    }
}

module.exports = { AUTHENTICATION };