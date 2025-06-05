const express = require("express");
const { catchAsyncHandle } = require("../middlewares/error.middleware");
const AuthMiddleware = require("../middlewares/auth.middleware");
const inputController = require("../controllers/input.controller");
const { checkRoles } = require("../middlewares/role.middleware");
const { USER_ROLES } = require("../configs/user.config");

const router = express.Router();

router.use(catchAsyncHandle(AuthMiddleware));

router.get("/details",
    /**
      * #swagger.tags = ['Input']
      * #swagger.description='Get all input details'
      */
    /* #swagger.parameters['query'] = {
        in: 'query',
        schema: {
            $ref: "#/components/schemas/GetAllInputDetails"
        }
    } */
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF] }),
    catchAsyncHandle(inputController.getAllInputDetails)
);

router.get("/details/:id",
    /**
      * #swagger.tags = ['Input']
      * #swagger.description='Get input detail'
      */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Input detail id',
        type: 'string'
    } */
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF, USER_ROLES.REPORT_STAFF] }),
    catchAsyncHandle(inputController.getInputDetail)
);

router.put("/details/:id",
    /**
      * #swagger.tags = ['Input']
      * #swagger.description='Update input detail'
      */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Input detail id',
        type: 'string'
    } */
    /*  #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/UpdateInputDetail"
                }  
            }
        }
    } */
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF,USER_ROLES.REPORT_STAFF] }),
    catchAsyncHandle(inputController.updateInputDetail)
)

router.get("/",
    /**
      * #swagger.tags = ['Input']
      * #swagger.description='Get all input requests'
      */
    /* #swagger.parameters['query'] = {
        in: 'query',
        schema: {
            $ref: "#/components/schemas/GetAllInputRequests"
        }
    } */
    catchAsyncHandle(inputController.getAllInputRequests)
);

router.get("/:id",
    /**
      * #swagger.tags = ['Input']
      * #swagger.description='Get input request'
      */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Input request id',
        type: 'string'
    } */
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF, USER_ROLES.SUPPLIER, USER_ROLES.REPORT_STAFF] }),
    catchAsyncHandle(inputController.getInputRequest)
);

router.post("/",
    /**
      * #swagger.tags = ['Input']
      * #swagger.description='Create a new input request'
      */
    /*  #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CreateInputRequest"
                }  
            }
        }
    } */
    checkRoles({ requiredRoles: [USER_ROLES.REPORT_STAFF] }),
    catchAsyncHandle(inputController.createInputRequest)
);

router.post("/clone",
    /**
      * #swagger.tags = ['Input']
      * #swagger.description='Clone an existing input request'
      */
    /*  #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CloneInputRequest"
                }  
            }
        }
    } */
    checkRoles({ requiredRoles: [USER_ROLES.REPORT_STAFF] }),
    catchAsyncHandle(inputController.cloneInputRequest)
);

router.put("/:id",
    /**
      * #swagger.tags = ['Input']
      * #swagger.description='Update input request'
      */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Input request id',
        type: 'string'
    } */
    /*  #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/UpdateInputRequest"
                }  
            }
        }
    } */
    checkRoles({ requiredRoles: [USER_ROLES.REPORT_STAFF, USER_ROLES.MANAGER] }),
    catchAsyncHandle(inputController.updateInputRequest)
);

router.patch("/:id/approve",
    /**
      * #swagger.tags = ['Input']
      * #swagger.description='Approve input request'
      */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Input request id',
        type: 'string'
    } */
    /*  #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ApproveInputRequest"
                }  
            }
        }
    } */
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER] }),
    catchAsyncHandle(inputController.approveInputRequest)
);

router.patch("/:id/assign",
    /**
      * #swagger.tags = ['Input']
      * #swagger.description='Assign input request'
      */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Input request id',
        type: 'string'
    } */
    /*  #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/AssignInputRequest"
                }  
            }
        }
    } */
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER] }),
    catchAsyncHandle(inputController.assignInputRequest)
);

router.patch("/:id/complete",
    /**
      * #swagger.tags = ['Input']
      * #swagger.description='Complete input request'
      */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Input request id',
        type: 'string'
    } */
    checkRoles({ requiredRoles: [USER_ROLES.INVENTORY_STAFF] }),
    catchAsyncHandle(inputController.completeInputRequest)
);

router.patch("/:id/cancel",
    /**
      * #swagger.tags = ['Input']
      * #swagger.description='Cancel input request'
      */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Input request id',
        type: 'string'
    } */
    checkRoles({ requiredRoles: [USER_ROLES.REPORT_STAFF, USER_ROLES.MANAGER] }),
    catchAsyncHandle(inputController.cancelInputRequest)
);

module.exports = router;