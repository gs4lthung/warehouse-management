const express = require("express");
const userController = require("../controllers/user.controller");
const { catchAsyncHandle } = require("../middlewares/error.middleware");
const { USER_ROLES } = require("../configs/user.config");
const { checkRoles, checkUserOrAdmin } = require("../middlewares/role.middleware");
const AuthMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Lấy danh sách tất cả users
router.get(
    "/",
    /**
      * #swagger.tags = ['User']
      * #swagger.description='Get all users'
      */
    /* #swagger.parameters['query'] = {
        in: 'query',
        schema: {
            $ref: "#/components/schemas/GetAllUsers"
        }
    } */
    catchAsyncHandle(userController.getAllUsers)
);

// Lấy danh sách inventoryStaffs theo workload
router.get(
    "/inventory-staffs/workload",
    /**
      * #swagger.tags = ['User']
      * #swagger.description='Get inventory staffs by workload'
      */
    catchAsyncHandle(userController.getInventoryStaffsByWorkload)
);

// Lấy thông tin user theo ID
router.get(
    "/:id",
    /**
      * #swagger.tags = ['User']
      * #swagger.description='Get user by ID'
      */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'User id',
        type: 'string'
    } */
    catchAsyncHandle(userController.getUserById)
);

// Tạo user mới (Chỉ Admin mới có quyền)
router.post(
    "/",
    /**
     * #swagger.tags = ['User']
     * #swagger.description='Create a new user'
     */
    /*  #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CreateUser"
                }  
            }
        }
    } 
*/
    catchAsyncHandle(AuthMiddleware),
    checkRoles({ requiredRoles: [USER_ROLES.ADMIN] }),
    catchAsyncHandle(userController.createUser)
);
router.put(
    "/:id",
    /**
    * #swagger.tags = ['User']
    * #swagger.description='Update own user by ID'
    */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'User id',
        type: 'string'
    } */
    /*  #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/UpdateUser"
                }  
            }
        }
    } 
    */
    catchAsyncHandle(AuthMiddleware),
    catchAsyncHandle(checkUserOrAdmin),
    catchAsyncHandle(userController.updateUser)
)
// Xóa user theo ID (Chỉ Admin mới có quyền)
router.delete(
    "/:id",
    /**
      * #swagger.tags = ['User']
      * #swagger.description='Delete user by ID'
      */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'User id',
        type: 'string'
    } */
    catchAsyncHandle(AuthMiddleware),
    checkRoles({ requiredRoles: [USER_ROLES.ADMIN] }),
    catchAsyncHandle(userController.deleteUser)
);

module.exports = router;
