const { validFullName, validEmail, validPassword, validMongoObjectId } = require("../../../utils/validator");
const { BadRequestError } = require("../../responses/error.response");

class UpdateUserDto {
    constructor(id, fullName, email, role) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;        
        this.role = role;
    }
    async validate() {
        try {
            await validMongoObjectId(this.id)
            if (this.fullName)
                await validFullName(this.fullName);
            if (this.email)
                await validEmail(this.email);            
            if (this.role) {
                if (this.role < 0 || this.role > 2)
                    throw new BadRequestError("Invalid Role")
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = UpdateUserDto;