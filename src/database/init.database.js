const mongoose = require("mongoose");
const {
  db: { name, userName, password, cluster },
} = require("../configs/config.mongodb");
const { countConnect } = require("../helpers/check.connect");
const getLogger = require("../utils/logger");
const chalk = require("chalk");
const logger = getLogger("DATABASE");

const connectString = `mongodb+srv://${userName}:${password}@${cluster}/${name}?retryWrites=true&w=majority&appName=Cluster0`;
class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (process.env.NODE_ENV === "dev") {
      // mongoose.set("debug", (collectionName, method, query, doc) => {
      //   logger.info(`${chalk.blueBright(collectionName)}.${chalk.yellow(method)}(Query: ${JSON.stringify(query)} ${Object.keys(doc)})`);

      // });

    }

    switch (type) {
      case "mongodb":
        const connectedDb = countConnect();
        mongoose
          .connect(connectString)
          .then((_) =>
            logger.info(
              `Connected to ${chalk.yellow(name)} database: ${chalk.yellow(
                connectedDb
              )}`
            )
          )
          .catch((err) => logger.error(err));
        break;
      default:
        break;
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDb = Database.getInstance();

module.exports = instanceMongoDb;
