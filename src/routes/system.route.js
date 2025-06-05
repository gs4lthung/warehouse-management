const express = require('express');
const { catchAsyncHandle } = require('../middlewares/error.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const {checkRoles} = require('../middlewares/role.middleware');
const { USER_ROLES } = require('../configs/user.config');
const systemController = require('../controllers/system.controller');

const router = express.Router();

router.use(catchAsyncHandle(AuthMiddleware))

router.get('/',
    /**
      * #swagger.tags = ['System']
      * #swagger.description='Get system config'
      */
    checkRoles({ requiredRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER] })
    , catchAsyncHandle(systemController.getSystemConfig)
)

module.exports = router;