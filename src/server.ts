import http from "http";
import app from "./app";
import config from "./config";
import db from "./db";

http.createServer(app.init()).listen(config.PORT, function () {
  console.log(`✔️ [server] => ${`${config.HOST}:${config.PORT}`} `);
  db.init(config.DB_URI);
});
