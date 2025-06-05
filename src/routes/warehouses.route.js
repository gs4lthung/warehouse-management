const express = require("express");
const { catchAsyncHandle } = require("../middlewares/error.middleware");
const warehouseController = require("../controllers/warehouse.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");
const {checkRoles} = require("../middlewares/role.middleware");
const { USER_ROLES } = require("../configs/user.config");

const router = express.Router();

router.use(catchAsyncHandle(AuthMiddleware));

router.get("/stock-check-requests",
    /**
      * #swagger.tags = ['Warehouse']
      * #swagger.description='Get all stock check request'
      */
    /* #swagger.parameters['query'] = {
        in: 'query',
        schema: {
            $ref: "#/components/schemas/GetAllStockCheckRequest"
        }
    } */
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF] }),
    catchAsyncHandle(warehouseController.getAllStockCheckRequests)
)

router.get("/stock-check-requests/:id",
    /**
      * #swagger.tags = ['Warehouse']
      * #swagger.description='Get a stock check request'
      */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Stock check request id',
        type: 'string'
    } */
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF] }),
    catchAsyncHandle(warehouseController.getStockCheckRequest)
)

router.post("/stock-check-requests",
    /**
      * #swagger.tags = ['Warehouse']
      * #swagger.description='Create a new stock check request'
      */
    /*  #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CreateStockCheckRequest"
                }  
            }
        }
    } 
*/
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF] }),
    catchAsyncHandle(warehouseController.createStockCheckRequest)
)

router.put("/stock-check-requests/:id",
    /**
      * #swagger.tags = ['Warehouse']
      * #swagger.description='Update a stock check request'
      */
    /*  #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Stock check request id',
        type: 'string'
    }
    #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/UpdateStockCheckRequest"
                }  
            }
        }
    }
*/
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF] }),
    catchAsyncHandle(warehouseController.updateStockCheckRequest)
)

router.delete("/stock-check-requests/:id",
    /**
      * #swagger.tags = ['Warehouse']
      * #swagger.description='Delete a stock check request'
      */
    /*  #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Stock check request id',
        type: 'string'
    }
*/
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF] }),
    catchAsyncHandle(warehouseController.deleteStockCheckRequest)
)

router.get("/stock-check-details",
    /**
      * #swagger.tags = ['Warehouse']
      * #swagger.description='Get all stock check details'
      */
    /* #swagger.parameters['query'] = {
        in: 'query',
        schema: {
            $ref: "#/components/schemas/GetAllStockCheckDetails"
        }
    } */
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF] }),
    catchAsyncHandle(warehouseController.getAllStockCheckDetails)
)

router.get("/stock-check-details/:id",
    /**
      * #swagger.tags = ['Warehouse']
      * #swagger.description='Get a stock check detail'
      */
    /*  #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Stock check detail id',
        type: 'string'
    }
*/
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF] }),
    catchAsyncHandle(warehouseController.getStockCheckDetail)
)

// router.post("/stock-check-details",
//     /**
//       * #swagger.tags = ['Warehouse']
//       * #swagger.description='Create a new stock check details'
//       */
//     /*  #swagger.requestBody = {
//         content: {
//             "application/json": {
//                 schema: {
//                     $ref: "#/components/schemas/CreateStockCheckDetails"
//                 }  
//             }
//         }
//     }
// */
//     checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF] }),
//     catchAsyncHandle(warehouseController.createStockCheckDetails)
// )

router.put("/stock-check-details/:id",
    /**
      * #swagger.tags = ['Warehouse']
      * #swagger.description='Update a stock check details'
      */
    /*  #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Stock check details id',
        type: 'string'
    }
    #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/UpdateStockCheckDetail"
                }  
            }
        }
    }
*/
    checkRoles({ requiredRoles: [USER_ROLES.INVENTORY_STAFF, USER_ROLES.MANAGER] }),
    catchAsyncHandle(warehouseController.updateStockCheckDetail)
)

router.delete("/stock-check-details/:id",
    /**
      * #swagger.tags = ['Warehouse']
      * #swagger.description='Delete a stock check details'
      */
    /*  #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Stock check details id',
        type: 'string'
    }
*/
    checkRoles({ requiredRoles: [USER_ROLES.INVENTORY_STAFF] }),
    catchAsyncHandle(warehouseController.deleteStockCheckDetail)
)

router.get("/storages",
    /**
      * #swagger.tags = ['Warehouse']
      * #swagger.description='Get all warehouse storages'
      */
    /* #swagger.parameters['query'] = {
        in: 'query',
        schema: {
            $ref: "#/components/schemas/GetAllWarehouseStorages"
        }
    } */
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF] }),
    catchAsyncHandle(warehouseController.getAllWarehouseStorages)
)

router.get("/storages/:id",
    /**
      * #swagger.tags = ['Warehouse']
      * #swagger.description='Get an warehouse storage'
      */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Warehouse Storage id',
        type: 'string'
    } */
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF] }),
    catchAsyncHandle(warehouseController.getWarehouseStorage)
)

router.delete("/storages/:id",
    /**
      * #swagger.tags = ['Warehouse']
      * #swagger.description='Delete an warehouse storage'
      */
    /*  #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Warehouse storage id',
        type: 'string'
    }
*/
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER] }),
    catchAsyncHandle(warehouseController.deleteWarehouseStorage)
)

router.get("/stock-transactions",
    /**
      * #swagger.tags = ['Warehouse']
      * #swagger.description='Get all stock transactions'
      */
    /* #swagger.parameters['query'] = {
        in: 'query',
        schema: {
            $ref: "#/components/schemas/GetAllStockTransactions"
        }
    } */
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF] }),
    catchAsyncHandle(warehouseController.getAllStockTransactions)
)

router.get("/stock-transactions/:id",
    /**
      * #swagger.tags = ['Warehouse']
      * #swagger.description='Get a stock transaction'
      */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Stock transaction id',
        type: 'string'
    } */
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF] }),
    catchAsyncHandle(warehouseController.getStockTransaction)
)

router.get("/checks",
    /**
     * #swagger.tags = ['Warehouse']
     * #swagger.description='Get all warehouse checks'
     */
    /* #swagger.parameters['query'] = {
        in: 'query',
        schema: {
            $ref: "#/components/schemas/GetAllWarehouseChecks"
        }
    } */
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF] }),
    catchAsyncHandle(warehouseController.getAllWarehouseChecks)
);

router.get("/checks/:id",
    /**
     * #swagger.tags = ['Warehouse']
     * #swagger.description='Get warehouse check by ID'
     */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Warehouse check id',
        type: 'string'
    } */
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF] }),
    catchAsyncHandle(warehouseController.getWarehouseCheck)
)

router.put("/checks/:id",
    /**
     * #swagger.tags = ['Warehouse']
     * #swagger.description='Update warehouse check by ID'
     */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Warehouse check id',
        type: 'string'
    } */
    /*  #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/UpdateWarehouseCheck"
                }  
            }
        }
    } 
*/
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER, USER_ROLES.INVENTORY_STAFF] }),
    catchAsyncHandle(warehouseController.updateWarehouseCheck)
)

router.post("/checks",
    /**
     * #swagger.tags = ['Warehouse']
     * #swagger.description='Create a new warehouse check'
     */
    /*  #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CreateWarehouseCheck"
                }  
            }
        }
    } 
*/
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER] }),
    catchAsyncHandle(warehouseController.createWarehouseCheck)
)

router.delete("/checks/:id",
    /**
     * #swagger.tags = ['Warehouse']
     * #swagger.description='Delete warehouse check by ID'
     */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Warehouse check id',
        type: 'string'
    } */
    checkRoles({ requiredRoles: [USER_ROLES.MANAGER] }),
    catchAsyncHandle(warehouseController.deleteWarehouseCheck)
)

router.get("/",
    /**
      * #swagger.tags = ['Warehouse']
      * #swagger.description='Get all warehouses'
      */
    /* #swagger.parameters['query'] = {
        in: 'query',
        schema: {
            $ref: "#/components/schemas/GetAllWarehouses"
        }
    } */
    catchAsyncHandle(warehouseController.getAllWarehouses)
);

router.get("/:id",
    /**
     * #swagger.tags = ['Warehouse']
     * #swagger.description='Get warehouse by ID'
     */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Warehouse id',
        type: 'string'
    } */
    catchAsyncHandle(warehouseController.getWarehouse)
)

router.post("/",
    /**
     * #swagger.tags = ['Warehouse']
     * #swagger.description='Create a new warehouse'
     */
    /*  #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CreateWarehouse"
                }  
            }
        }
    } 
*/
    catchAsyncHandle(warehouseController.createWarehouse)
)

router.put("/:id",
    /**
     * #swagger.tags = ['Warehouse']
     * #swagger.description='Update warehouse by ID'
     */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Warehouse id',
        type: 'string'
    } */
    /*  #swagger.requestBody = {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/UpdateWarehouse"
                }  
            }
        }
    } 
*/
    catchAsyncHandle(warehouseController.updateWarehouse)
)

router.delete("/:id",
    /**
     * #swagger.tags = ['Warehouse']
     * #swagger.description='Delete warehouse by ID'
     */
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Warehouse id',
        type: 'string'
    } */
    catchAsyncHandle(warehouseController.deleteWarehouse)
)

module.exports = router;