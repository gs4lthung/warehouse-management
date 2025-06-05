const compression = require("compression");
const express = require("express");
const session = require("express-session");
const { default: helmet } = require("helmet");
const app = express();
require("dotenv").config();
const MemoryStore = require("memorystore")(session);
const rateLimiter = require("./utils/rateLimiter");
const { handleApiRequest } = require("./middlewares/request.middleware");
const { checkNotFoundError } = require("./middlewares/error.middleware");
const { handleErrorResponse } = require("./utils/response");
const cors = require("cors");

// set default timezone
process.env.TZ = "Asia/Ho_Chi_Minh";

// init session
app.use(
  session({
    cookie: { maxAge: parseInt(process.env.SESSION_EXPIRES_IN) },
    store: new MemoryStore({
      checkPeriod: parseInt(process.env.SESSION_EXPIRES_IN),
    }),
    resave: false,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
  })
);

// init middlewares
app.use(helmet()); // secure app by setting various HTTP headers
app.use(compression()); // compress all responses
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use("/", express.static("public")); // serve static files in public folder
app.disable("x-powered-by"); // disable x-powered-by header
app.set("trust proxy", 1); // trust first proxy
app.use(
  rateLimiter(process.env.RATE_LIMITER_TIME, process.env.RATE_LIMITER_REQUESTS)
); // rate limiter
app.use(
  cors({
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); // enable cors

// init database
require("./database/init.database");

if (process.env.NODE_ENV === "dev") {
  // init swagger
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('../swagger-output.json');
  const basicAuth = require("express-basic-auth");
  const { AUTHENTICATION } = require("./configs/auth.config");
  const users = AUTHENTICATION.swagger.users
  const swaggerOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
    }
  }
  app.use('/api-docs', basicAuth({ users, challenge: true }), swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
}

// init socket
const { socket } = require("../socket");
const server = require("http").createServer(app)
const { instrument } = require("@socket.io/admin-ui");
const io = require("socket.io")(server, {
  cors: {
    origin: ["https://admin.socket.io", process.env.CLIENT_BASE_URL],
    methods: ["GET", "POST"],
    credentials: true
  }
})
instrument(io, {
  auth: false,
})
if (!io.initialized) {
  socket(io)
  io.initialized = true
}

// init cron jobs
const { startCronJobs } = require("./utils/cronJob");
startCronJobs();

// request logger
// app.use(handleApiRequest);

// init routes
app.use("/api/v1", require("./routes"));
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the API");
  res.end();
});

// error handler
app.use(checkNotFoundError);
app.use(handleErrorResponse);

module.exports = server;