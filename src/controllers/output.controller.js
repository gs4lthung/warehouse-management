const { CREATED, OK } = require("../core/responses/success.response");
const OutputService = require("../services/output.service");

class OutputController {
    getAllOutputRequests = async (req, res) => {
        new OK({
            message: "Get all output requests successfully",
            metadata: await OutputService.getAllOutputRequests({
                limit: req.query.limit || 1000,
                sort: req.query.sort || 'ctime',
                page: req.query.page || 1,
                filter: req.query.filter ? JSON.parse(req.query.filter) : { isDeleted: false },
                select: req.query.select || '',
                expand: req.query.expand || ''
            })
        }).send(res)
    }

    getOutputRequest = async (req, res) => {
        new OK({
            message: "Get output request successfully",
            metadata: await OutputService.getOutputRequest({
                id: req.params.id
            })
        }).send(res)
    }

    createOuputRequest = async (req, res, next, session) => {
        new CREATED({
            message: "Create output request successfully",
            metadata: await OutputService.createOuputRequest({ session: session, ...req.body })
        }).send(res)
    }

    updateOutputRequest = async (req, res) => {
        new OK({
            message: "Update output request successfully",
            metadata: await OutputService.updateOutputRequest({
                id: req.params.id,
                ...req.body
            })
        }).send(res)
    }

    getAllOuputDetails = async (req, res) => {
        new OK({
            message: "Get all output details successfully",
            metadata: await OutputService.getAllOutputDetails({
                limit: req.query.limit || 1000,
                sort: req.query.sort || 'ctime',
                page: req.query.page || 1,
                filter: req.query.filter ? JSON.parse(req.query.filter) : { isDeleted: false },
                select: req.query.select || '',
                expand: req.query.expand || ''
            })
        }).send(res)
    }

    getOutputDetail = async (req, res) => {
        new OK({
            message: "Get output detail successfully",
            metadata: await OutputService.getOutputDetail({
                id: req.params.id
            })
        }).send(res)
    }

    updateOutputDetail = async (req, res) => {
        new OK({
            message: "Update output detail successfully",
            metadata: await OutputService.updateOutputDetail({
                id: req.params.id,
                ...req.body,
                requesterId: req.userId
            })
        }).send(res)
    }

    approveOutputRequest = async (req, res) => {
        new OK({
            message: "Approve output request successfully",
            metadata: await OutputService.approveOutputRequest({
                id: req.params.id,
                managerId: req.body.managerId
            })
        }).send(res)
    }

    assignOutputRequest = async (req, res) => {
        new OK({
            message: "Assign output request successfully",
            metadata: await OutputService.assignOutputRequest({
                id: req.params.id,
                ...req.body
            })
        }).send(res)
    }

    completeOutputRequest = async (req, res, next, session) => {
        new OK({
            message: "Complete output request successfully",
            metadata: await OutputService.completeOutputRequest({
                id: req.params.id,
                session: session,
            })
        }).send(res)
    }

    cancelOutputRequest = async (req, res) => {
        new OK({
            message: "Cancel output request successfully",
            metadata: await OutputService.cancelOutputRequest({
                id: req.params.id,
                ...req.body
            })
        }).send(res)
    }
}

module.exports = new OutputController();