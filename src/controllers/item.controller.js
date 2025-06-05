const { OK, CREATED } = require("../core/responses/success.response")
const ItemService = require("../services/item.service")

class ItemController {
    getAllItems = async (req, res) => {
        new OK({
            message: "Get all items successfully",
            metadata: await ItemService.getAllItems({
                limit: req.query.limit || 1000,
                sort: req.query.sort || 'ctime',
                page: req.query.page || 1,
                filter: req.query.filter ? JSON.parse(req.query.filter) : { isDeleted: false }, // http://localhost:8386/api/v1/users?filter={"isDeleted":false}
                select: req.query.select || '',
                expand: req.query.expand || ''
            })
        }).send(res)
    }
    getDetailItem = async (req,res) => {                
        new OK({
            message:"Get item successfully",
            metadata: await ItemService.getDetailItem(req.params,req.query.expand)
        }).send(res)
    }
    createItems = async (req,res) => {        
        new OK({
            message: 'Create item successfully',
            metadata: await ItemService.createItem(req.body)
        })
    }
    updateItems = async (req, res) => {
        new OK({
            message: "Update item successfully",
            metadata: await ItemService.updateItem(req.body)
        }).send(res)
    }
    deleteItems = async (req, res) => {
        new OK({
            message: "Delete item successfully",
            metadata: await ItemService.deleteItem(req.params)
        }).send(res)
    }
    updateCheckExpiredMedicineInterval = async (req, res) => {
        new OK({
            message: "Update check expired medicine interval successfully",
            metadata: await ItemService.updateExpiredMedicineInterval(req.body)
        }).send(res)
    }
    createDisposalRequest = async (req,res) => {
        new CREATED({
            message: "Create request successfully",
            metadata: await ItemService.createDisposalRequest(req.body)
        }).send(res)
    }
}

module.exports = new ItemController();