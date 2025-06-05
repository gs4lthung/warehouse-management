const validator = require("validator");
const { BadRequestError, NotFoundRequestError } = require("../core/responses/error.response");

const validFullName = async (fullName) => {
  if (!fullName) throw new BadRequestError("Full name is required.");
  if (!validator.isLength(fullName, { min: 6, max: 50 }))
    throw new BadRequestError("Full name must be between 6 and 50 characters.");
  const regex = /^[A-ZÀ-Ỹ][a-zà-ỹ]*(?:\s[A-ZÀ-Ỹa-zà-ỹ0-9]+)*\s\d+$/;
  if (!regex.test(fullName)) {
    throw new BadRequestError("Full name is not valid.");
  }
};

const validEmail = async (email) => {
  if (!email) throw new BadRequestError("Email is required.");
  if (!validator.isEmail(email))
    throw new BadRequestError("Email is not valid.");
};

const validPassword = async (password) => {
  if (!password) throw new BadRequestError("Password is required.");
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  )
    throw new BadRequestError("Password is not strong enough.");
};

const validMongoObjectId = async (id) => {
  if (!id) throw new BadRequestError("Id is required.");
  if (!validator.isMongoId(id)) throw new NotFoundRequestError("Not found.");
}

module.exports = { validFullName, validEmail, validPassword, validMongoObjectId };
