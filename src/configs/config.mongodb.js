require("dotenv").config();

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 8386,
  },
  db: {
    name: process.env.DEV_DB_NAME,
    userName: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    cluster: process.env.DEV_DB_CLUSTER,
  },
};
const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 8388,
  },
  db: {
    name: process.env.PRO_DB_NAME,
    userName: process.env.PRO_DB_USERNAME,
    password: process.env.PRO_DB_PASSWORD,
    cluster: process.env.PRO_DB_CLUSTER,
  },
};

const config = {
  dev,
  pro,
};
const env = process.env.NODE_ENV || "dev";

module.exports = config[env];
