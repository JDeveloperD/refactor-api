const path = require("path");
require("dotenv").config();

export default {
  DB_URI: process.env.DB_URI || "mongodb://localhost/api_cieneguilla",
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || "localhost",
  JWT_SECRET: process.env.SECRET || "RANDOM_SECRET",
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  BUCKETS: {
    NAME: "svr-cieneguilla.appspot.com",
    PATH_KEY: path.join("./keys-storage.json"),
    ORIGIN: [
      "https://api-dot-svr-cieneguilla.uc.r.appspot.com",
      "https://svr-cieneguilla.uc.r.appspot.com",
    ],
  },
};
