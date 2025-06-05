const express = require("express");
const AuthMiddleware = require("../middlewares/auth.middleware");
const { USER_ROLES } = require("../configs/user.config");
const {checkRoles} = require("../middlewares/role.middleware");
const { catchAsyncHandle } = require("../middlewares/error.middleware");
const baseItemsController = require("../controllers/baseItems.controller");

const router = express.Router();
router.use(
    catchAsyncHandle(AuthMiddleware),
    checkRoles({
        requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.REPORT_STAFF]
    })
)

router.get("/",
    /**
      * #swagger.tags = ['BaseItems']
      * #swagger.description='Get all base items'
      */
    /* #swagger.parameters['query'] = {
        in: 'query',
        schema: {
            $ref: "#/components/schemas/GetAllBaseItems"
        }
    } */
    catchAsyncHandle(baseItemsController.getAllBaseItem)
)
router.get("/:id",
    /**
      * #swagger.tags = ['BaseItems']
      * #swagger.description='Get base item detail'
      */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Base item id',
        type: 'string'
    } */
    catchAsyncHandle(baseItemsController.getDetailBaseItem)
)
router.post("/",
    /**
     * #swagger.tags = ['BaseItems']
     * #swagger.description='Create a new item'
     */
    /*  #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CreateBaseItem"
                }  
            }
        }
    } */
    catchAsyncHandle(baseItemsController.createBaseItem)
)
router.put("/:id",
    /**
      * #swagger.tags = ['BaseItems']
      * #swagger.description='Update base item'
      */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Base item id',
        type: 'string'
    } */
    /*  #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/UpdateBaseItem"
                }  
            }
        }
    } 
*/
    catchAsyncHandle(baseItemsController.updateBaseItem)
)
router.delete('/:id',
    /**
      * #swagger.tags = ['BaseItems']
      * #swagger.description='Delete base item'
      */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Base item id',
        type: 'string'
    } */
    catchAsyncHandle(baseItemsController.deleteBaseItem)
)
module.exports = router;