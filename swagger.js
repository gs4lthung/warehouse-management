const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });
require("dotenv").config();

const {
  SELECT_OUTPUT,
  SELECT_OUTPUT_DETAILS,
} = require("./src/configs/output.config.js");
const { SELECT_ITEM } = require("./src/configs/item.config.js");
const { SELECT_USER } = require("./src/configs/user.config.js");
const {
  SELECT_WAREHOUSE,
  SELECT_WAREHOUSE_CHECK,
  SELECT_STOCK_DETAIL,
  SELECT_STOCK_REQUEST,
  SELECT_STOCK_TRANSACTION,
  SELECT_WAREHOUSE_STORAGE,
} = require("./src/configs/warehouse.config.js");
const { SELECT_BASEITEM } = require("./src/configs/baseitem.config.js");
const {
  SELECT_INPUT,
  SELECT_INPUT_DETAILS,
} = require("./src/configs/input.config.js");
const doc = {
  host: `localhost:${process.env.DEV_APP_PORT}`, // by default: 'localhost:3000'
  info: {
    version: "1.0.0", // by default: '1.0.0'
    title: "Medical Warehouse System API", // by default: 'REST API'
    description: "", // by default: ''
  },
  servers: [
    {
      url: `http://localhost:${process.env.DEV_APP_PORT}`,
      description: "Development Port", // by default: ''
    },
    // { ... }
  ],
  tags: [
    // by default: empty Array
    {
      name: "Auth", // Tag name
      description: "", // Tag description
    },
    {
      name: "User",
      description: "",
    },
    {
      name: "Warehouse",
      description: "",
    },
    {
      name: "Item",
      description: "",
    },
    {
      name: "System",
      description: "",
    },
    {
      name: "Output",
      description: "",
    },
    // { ... }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Login: {
        $email: "abc@gmail.com",
        $password: "***",
      },
      Signup: {
        $fullName: "John Doe",
        $email: "abc@gmail.com",
        $password: "***",
      },
      ResetPassword: {
        $newPassword: "***",
      },
      GetAllUsers: {
        limit: 10,
        sort: "ctime",
        page: 1,
        filter: {
          isDeleted: false,
        },
        select: SELECT_USER.DEFAULT,
      },
      CreateUser: {
        $fullName: "John Doe",
        $email: "abc@gmail.com",
        $password: "***",
        role: "Customer",
      },
      UpdateUser: {
        $fullName: "John Doe",
        $email: "abc@gmail.com",
        $password: "***",
        role: "Customer",
      },
      GetAllWarehouses: {
        limit: 10,
        sort: "ctime",
        page: 1,
        filter: {
          isDeleted: false,
        },
        select: SELECT_WAREHOUSE.DEFAULT,
      },
      CreateWarehouse: {
        $name: "Warehouse 1",
        $description: "Warehouse 1",
        $category: "Medicine",
        $minTemperature: 2,
        $maxTemperature: 8,
      },
      UpdateWarehouse: {
        name: "Warehouse 1",
        description: "Warehouse 1",
        category: "Medicine",
        minTemperature: 2,
        maxTemperature: 8,
      },
      GetAllWarehouseChecks: {
        limit: 10,
        sort: "ctime",
        page: 1,
        filter: {
          isDeleted: false,
        },
        select: SELECT_WAREHOUSE_CHECK.DEFAULT,
        expand: "warehouse manager inventoryStaff",
      },
      CreateWarehouseCheck: {
        $warehouseId: "60e0b3f0b3f0b3f0b3f0b3f0",
        $managerId: "60e0b3f0b3f0b3f0b3f0b3f0",
        $inventoryStaffIds: [
          "60e0b3f0b3f0b3f0b3f0b3f0",
          "60e0b3f0b3f0b3f0b3f0b3f0",
        ],
        description: "Check warehouse 1",
        $fromDate: "2025-02-19T08:37:54.729+00:00",
        $toDate: "2025-02-19T08:37:54.729+00:00",
      },
      UpdateWarehouseCheck: {
        description: "Check warehouse 1",
        temperature: 5,
        thresholdLevel: "Normal",
        condition: "Good",
        status: "Done",
      },
      GetAllWarehouseStorages: {
        limit: 10,
        sort: "ctime",
        page: 1,
        filter: {
          isDeleted: false,
        },
        select: SELECT_WAREHOUSE_STORAGE,
        expand: "warehouse item",
      },
      CreateWarehouseStorage: {
        $warehouseId: "60e0b3f0b3f0b3f0b3f0b3f0",
        $itemId: "60e0b3f0b3f0b3f0b3f0b3f0",
        $quantity: 100,
      },
      GetAllStockTransactions: {
        limit: 10,
        sort: "ctime",
        page: 1,
        filter: {
          isDeleted: false,
        },
        select: SELECT_STOCK_TRANSACTION,
        expand: "warehouse item",
      },
      GetAllStockCheckRequest: {
        limit: 10,
        sort: "ctime",
        page: 1,
        filter: {
          isDeleted: false,
        },
        select: SELECT_STOCK_REQUEST,
        expand: "warehouse manager inventoryStaff",
      },
      GetAllStockCheckDetails: {
        limit: 10,
        sort: "ctime",
        page: 1,
        filter: {
          isDeleted: false,
        },
        select: SELECT_STOCK_DETAIL,
        expand: "stockCheck item",
      },
      CreateStockCheckRequest: {
        description: "Stock check for warehouse 1",
        $warehouseId: "60e0b3f0b3f0b3f0b3f0b3f0",
        $managerId: "60e0b3f0b3f0b3f0b3f0b3f0",
        $inventoryStaffIds: [
          "60e0b3f0b3f0b3f0b3f0b3f0",
          "60e0b3f0b3f0b3f0b3f0b3f0",
        ],
        $fromDate: "2025-02-19T08:37:54.729+00:00",
        $toDate: "2025-02-19T08:37:54.729+00:00",
      },
      CreateStockCheckDetails: {
        stockCheckDetails: [
          {
            $stockCheckId: "60e0b3f0b3f0b3f0b3f0b3f0",
            $itemId: "60e0b3f0b3f0b3f0b3f0b3f0",
            $systemQuantity: 100,
            $actualQuantity: 100,
          },
        ],
      },
      UpdateStockCheckRequest: {
        description: "",
        status: "",
        fromDate: "2025-02-19T08:37:54.729+00:00",
        toDate: "2025-02-19T08:37:54.729+00:00",
        cancelReason: "",
      },
      UpdateStockCheckDetail: {
        description: "",
        actualQuantity: 100,
        status: "Done",
      },
      GetAllBaseItems: {
        limit: 10,
        sort: "ctime",
        page: 1,
        filter: {
          isDeleted: false,
        },
        select: SELECT_BASEITEM.DEFAULT,
        expand: "avgInputPrice totalQuantity",
      },
      CreateBaseItem: {
        $name: "Paracetamol",
        $genericName: "Paracetamol",
        $description: "Paracetamol",
        $category: "Medicine",
        $brand: "Paracetamol",
        $countryOfOrigin: "Vietnam",
        $indication: "Fever",
        $contraindication: "None",
        $sideEffect: "None",
        $storageType: "Normal",
      },
      UpdateBaseItem: {
        $id: "60e0b3f0b3f0b3f0b3f0b3f0",
        name: "Paracetamol",
        genericName: "Paracetamol",
        description: "Paracetamol",
        brand: "Paracetamol",
        countryOfOrigin: "Vietnam",
        indication: "Fever",
        contraindication: "None",
        sideEffect: "None",
        storageType: "Normal",
      },
      GetAllItems: {
        limit: 10,
        sort: "ctime",
        page: 1,
        filter: {
          isDeleted: false,
        },
        select: SELECT_ITEM,
        expand: "baseItem",
      },
      CreateItem: {
        $baseItemId: "60e0b3f0b3f0b3f0b3f0b3f0",
        $status: "Available",
        $manufactureDate: "2021-07-01",
        $expiredDate: "2022-07-01",
        $unit: "Box",
      },
      UpdateItem: {
        $id: "60e0b3f0b3f0b3f0b3f0b3f0",
        status: "Available",
        expiredDate: "2022-07-01",
        isFrozenStored: true,
      },
      UpdateCheckExpiredMedicineInterval: {
        $job: "checkExpiredMedicine",
        $interval: "0 0 * * *",
      },
      GetAllOutputRequests: {
        limit: 10,
        sort: "ctime",
        page: 1,
        filter: {
          isDeleted: false,
        },
        select: SELECT_OUTPUT,
        expand: "customer reportStaff manager inventoryStaffs",
      },
      GetAllOutputDetails: {
        limit: 10,
        sort: "ctime",
        page: 1,
        filter: {
          isDeleted: false,
        },
        select: SELECT_OUTPUT_DETAILS,
        expand: "output item",
      },
      UpdateOutputDetails: {
        quantity: 10,
        outputPrice: 1000,
        status: "Done",
      },
      CreateOutputRequest: {
        $reportStaffId: "60e0b3f0b3f0b3f0b3f0b3f0",
        $customerId: "60e0b3f0b3f0b3f0b3f0b3f0",
        description: "Output request for warehouse 1",
        outputDetails: [
          {
            $itemId: "60e0b3f0b3f0b3f0b3f0b3f0",
            $quantity: 10,
            $outputPrice: 1000,
          },
        ],
      },
      UpdateOutputRequest: {
        description: "Output request for warehouse 1",
        fromDate: "2025-02-19T08:37:54.729+00:00",
        toDate: "2025-02-19T08:37:54.729+00:00",
        inventoryStaffIds: [
          "60e0b3f0b3f0b3f0b3f0b3f0",
          "60e0b3f0b3f0b3f0b3f0b3f0",
        ],
      },
      ApproveOutputRequest: {
        $managerId: "60e0b3f0b3f0b3f0b3f0b3f0",
      },
      RejectOutputRequest: {
        $managerId: "60e0b3f0b3f0b3f0b3f0b3f0",
      },
      AssignOutputRequest: {
        $inventoryStaffIds: [
          "60e0b3f0b3f0b3f0b3f0b3f0",
          "60e0b3f0b3f0b3f0b3f0b3f0",
        ],
        $fromDate: "2025-02-19T08:37:54.729+00:00",
        $toDate: "2025-02-19T08:37:54.729+00:00",
      },
      CancelOutputRequest: {
        $cancelReason: "Out of stock",
      },
      GetAllInputRequests: {
        limit: 10,
        sort: "ctime",
        page: 1,
        filter: {
          isDeleted: false,
        },
        select: SELECT_INPUT,
        expand: "supplier reportStaff manager inventoryStaffs",
      },
      GetAllInputDetails: {
        limit: 10,
        sort: "ctime",
        page: 1,
        filter: {
          isDeleted: false,
        },
        select: SELECT_INPUT_DETAILS,
        expand: "input item",
      },
      UpdateInputDetail: {
        requestQuantity: 10,
        actualQuantity: 10,
        inputPrice: 1000,
        manufactureDate: "2021-07-01T00:00:00.000Z",
        expiredDate: "2022-07-01T00:00:00.000Z",
        status: "Done",
      },
      CreateInputRequest: {
        $reportStaffId: "60e0b3f0b3f0b3f0b3f0b3f0",
        $supplierId: "60e0b3f0b3f0b3f0b3f0b3f0",
        description: "Input request for warehouse 1",
        oldInputId: "60e0b3f0b3f0b3f0b3f0b3f0",
        inputDetails: [
          {
            $baseItemId: "60e0b3f0b3f0b3f0b3f0b3f0",
            $quantity: 10,
          },
        ],
      },
      UpdateInputRequest: {
        description: "Input request for warehouse 1",
        fromDate: "2025-02-19T08:37:54.729+00:00",
        toDate: "2025-02-19T08:37:54.729+00:00",
        inventoryStaffIds: [
          "60e0b3f0b3f0b3f0b3f0b3f0",
          "60e0b3f0b3f0b3f0b3f0b3f0",
        ],
      },
      ApproveInputRequest: {
        managerId: "60e0b3f0b3f0b3f0b3f0b3f0",
      },
      AssignInputRequest: {
        inventoryStaffIds: [
          "60e0b3f0b3f0b3f0b3f0b3f0",
          "60e0b3f0b3f0b3f0b3f0b3f0",
        ],
        fromDate: "2025-02-19T08:37:54.729+00:00",
        toDate: "2025-02-19T08:37:54.729+00:00",
      },
      CancelInputRequest: {
        $cancelReason: "Supplier delay",
      },
      CloneInputRequest: {
        $reportStaffId: "60e0b3f0b3f0b3f0b3f0b3f0",
        supplierId: "60e0b3f0b3f0b3f0b3f0b3f0", // Optional
        description: "Cloned input request", // Optional
        $oldInputId: "60e0b3f0b3f0b3f0b3f0b3f0", // Required
        inputDetails: [
          // Optional
          {
            itemId: "item1",
            quantity: 15,
          },
          {
            itemId: "item3",
            quantity: 30,
          },
        ],
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ], // by default: empty object
};

const outputFile = "./swagger-output.json";
const routes = ["./src/app.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

const chalk = require("chalk");
const getLogger = require("./src/utils/logger");
const {
  getAvgInputPriceOfBaseItem,
} = require("./src/repositories/baseItem.repo.js");

const logger = getLogger("SWAGGER");
swaggerAutogen(outputFile, routes, doc).then(() => {
  logger.info(
    `📄 Docs are running at ${chalk.magenta(
      chalk.underline(`${process.env.APP_BASE_URL}` + "/api-docs")
    )}`
  );
  require("./server.js");
});
