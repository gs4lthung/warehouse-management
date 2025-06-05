const { CREATED, OK, UPDATED, DELETED } = require("../core/responses/success.response")
const BaseItemService = require("../services/baseitem.service")

class BaseItemController {
    createBaseItem = async (req, res) => {
        new CREATED({
            message: "Create base item successfully!",
            metadata: await BaseItemService.createItem(req.body)
        }).send(res)
    }

    getAllBaseItem = async (req, res) => {
        new OK({
            message: "Get all baseItems successfully",
            metadata: await BaseItemService.getAllBaseItem({
                limit: req.query.limit || 1000,
                sort: req.query.sort || 'ctime',
                page: req.query.page || 1,
                filter: req.query.filter ? JSON.parse(req.query.filter) : { isDeleted: false }, // http://localhost:8386/api/v1/users?filter={"isDeleted":false}
                select: req.query.select || '',
                expand: req.query.expand || ''
            })
        }).send(res)
    }
    getDetailBaseItem = async (req, res) => {
        new OK({
            message: "Get item successfully",
            metadata: await BaseItemService.getDetailBaseItem(req.params)
        }).send(res)
    }
    updateBaseItem = async (req, res) => {
        new UPDATED({
            message: "Update baseItem successfully",
            metadata: await BaseItemService.updateBaseItem({
                id: req.params.id,
                ...req.body
            })
        }).send(res)
    }
    deleteBaseItem = async (req, res) => {
        new DELETED({
            message: "Delete baseItem successfully",
            metadata: await BaseItemService.deleteBaseItem(req.params)
        }).send(res)
    }
}
module.exports = new BaseItemController()
