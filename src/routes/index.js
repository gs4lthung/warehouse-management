const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");

// const warehouseModel = require("../models/warehouse.model");
// const inputModel = require("../models/input.model");
const { default: mongoose } = require("mongoose");
const warehouseStorageModel = require("../models/warehouseStorage.model");
// const inputDetailModel = require("../models/inputDetail.model");
// const inventoryModel = require("../models/inventory.model");
// const stockTransactionModel = require("../models/stockTransaction.model");
// const outputModel = require("../models/output.model");
// const outputDetailModel = require("../models/outputDetail.model");
// const stockCheckModel = require("../models/stockCheck.model");
// const stockCheckDetailModel = require("../models/stockCheckDetail.model");
// const warehouseTransactionModel = require("../models/warehouseTransaction.model");
// const warehouseTransactionDetailModel = require("../models/warehouseTransactionDetail.model");
// const warehouseCheckModel = require("../models/warehouseCheck.model");
// const userModel = require("../models/user.model");
// const warehouseCheckDetailModel = require("../models/warehouseCheckDetail.model");
// const reportModel = require("../models/report.model");
// const reportDetailModel = require("../models/reportDetail.model");
// const systemModel = require("../models/system.model");

router.get("/", async (req, res) => {
    res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="${process.env.APP_BASE_URL}/images/logo.png" type="image/x-icon">
    <title>Medical Warehouse API</title>
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            text-align: center;
            background: linear-gradient(to right, #74ebd5, #acb6e5);
            padding: 20px;
            overflow: hidden;
        }
        .container {
            max-width: 800px;
            margin: 50px auto;
            background: white;
            padding: 40px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            border-radius: 15px;
            opacity: 0;
            transform: translateY(-30px);
            animation: fadeIn 1s ease-in-out forwards;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .container:hover {
            transform: scale(1.05);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }
        @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-30px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        h1, h2 {
            color: #2c3e50;
            font-weight: bold;
        }
        p {
            color: #555;
            font-size: 18px;
        }
        .btn {
            display: inline-block;
            margin-top: 20px;
            padding: 15px 30px;
            background: linear-gradient(90deg, #3498db, #8e44ad);
            color: white;
            text-decoration: none;
            border-radius: 30px;
            transition: transform 0.3s, box-shadow 0.3s;
            font-size: 18px;
            font-weight: bold;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        .btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }
        .info {
            margin-top: 30px;
            text-align: center;
            padding: 25px;
            background: #f9f9f9;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .info h3 {
            color: #2c3e50;
            margin-bottom: 15px;
        }
        .info ul {
            list-style: none;
            padding: 0;
        }
        .info ul li {
            font-size: 18px;
            padding: 10px;
            background: #e3f2fd;
            margin: 5px 0;
            border-radius: 8px;
            transition: transform 0.3s;
        }
        .info ul li:hover {
            transform: scale(1.05);
            background: #bbdefb;
        }
        .footer {
            margin-top: 30px;
            font-size: 16px;
            color: #333;
            opacity: 0;
            transform: translateY(10px);
            animation: fadeIn 1s ease-in-out forwards 0.5s;
        }
        .footer a {
            color: #3498db;
            text-decoration: none;
            font-weight: bold;
            transition: color 0.3s;
        }
        .footer a:hover {
            color: #8e44ad;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to</h1>
        <h2>Medical Warehouse Management System</h2>
        <a href="/api-docs" class="btn">View API Documentation</a>
        <div class="info">
            <h3>Key Features</h3>
            <ul>
                <li>Real-time inventory tracking</li>
                <li>Automated stock alerts</li>
                <li>Detailed analytics and reports</li>
                <li>Secure authentication and user management</li>
            </ul>
        </div>
        <div class="footer">
            <p><a href="https://github.com/NguyenTienKha2908/SPRING2025_SWD392_NET1704_LaLuot_BE" target="_blank">github.com/medical-warehouse-management-api</a></p>
            <p>Lả Lướt ___ FPT University ___ 2025</p>
        </div>
    </div>
</body>
</html>
  `);
    res.end();
});

router.use("/auth", require("./auth.route"));
router.use("/users", require("./users.route"));
router.use("/items", require("./items.route"));
router.use("/baseitems", require("./baseItems.route"));
router.use("/system", require("./system.route"));
router.use("/outputs", require("./outputs.route"));
router.use("/warehouses", require("./warehouses.route"));
router.use("/inputs", require("./inputs.route"));

module.exports = router;
