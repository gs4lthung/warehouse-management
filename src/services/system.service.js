const systemModel = require("../models/system.model")

class SystemService {
    static getSystemConfig = async () => {
        const systemConfig = await systemModel.findOne({isDeleted: false});

        return systemConfig;
    }
}

module.exports = SystemService;