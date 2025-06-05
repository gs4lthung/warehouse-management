const { ROLES } = require("../configs/user.config");
const CreateUserDto = require("../core/dtos/users/create.user.dto");
const UpdateUserDto = require("../core/dtos/users/update.user.dto");
const {
    NotFoundRequestError,
    BadRequestError,
} = require("../core/responses/error.response");
const userModel = require("../models/user.model");
const { getAllUsers, getInventoryStaffsByWorkload } = require("../repositories/user.repo");
const { validMongoObjectId } = require("../utils/validator");
const bcrypt = require("bcrypt");
require("dotenv").config();

class UserService {
    static getAllUsers = async ({ limit, sort, page, filter, select }) => {
        return await getAllUsers({ limit, sort, page, filter, select });
    };

    static getInventoryStaffsByWorkload = async () => {
        return await getInventoryStaffsByWorkload();
    }

    static getUserById = async ({ id }) => {
        await validMongoObjectId(id);
        const userHolder = await userModel.findById(id).lean();
        if (!userHolder) {
            throw new NotFoundRequestError("User not found");
        }
        return userHolder;
    };

    static createUser = async ({ fullName, email, password, role }) => {
        const createUserDto = new CreateUserDto(fullName, email, password);
        await createUserDto.validate();

        const userHolder = await userModel.findOne({ email }).lean();
        if (userHolder) {
            throw new BadRequestError("Email already exists");
        }

        const passwordHash = await bcrypt.hash(
            password,
            parseInt(process.env.PASSWORD_SALT)
        );

        const newUser = await userModel.create({
            fullName,
            email,
            password: passwordHash,
            role: role || ROLES.STAFF,
            isVerified: true,
        });
        return;
    };

    static updateUser = async ({ id, fullName, email, role }) => {
        const updateUserDto = new UpdateUserDto(
            id,
            fullName,
            email,
            role
        );
        await updateUserDto.validate();

        const userHolder = await userModel.findById(id).lean();
        if (!userHolder) {
            throw new NotFoundRequestError("User not found");
        }

        await userModel.updateOne({ _id: id }, {
            fullName: fullName || userHolder.fullName,
            email: email || userHolder.email,
            role: role || userHolder.role,
        });
        return;
    };

    static deleteUser = async ({ id }) => {
        const userHolder = await userModel.findOne({ _id: id, isDeleted: false }).lean();
        if (!userHolder) {
            throw new NotFoundRequestError("User not found");
        }

        await userModel.updateOne({ _id: id }, { isDeleted: true });

        return user;
    };
}

module.exports = UserService;
