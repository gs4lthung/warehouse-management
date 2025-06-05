const { OK } = require("../core/responses/success.response");
const SystemService = require("../services/system.service");

class SystemController {
    getSystemConfig = async (req, res) => {
        new OK({
            message: "Get system config success",
            metadata: await SystemService.getSystemConfig()
        }).send(res)
    }
}

module.exports = new SystemController();