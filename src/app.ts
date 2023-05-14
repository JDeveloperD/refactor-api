import "express-async-errors";
import express from "express";
import cors from "cors";

import router from "./v2/router/router";
import { userModule } from "./v2/modules";

// const notFound = require("./middlewares/not-found");
// const errorHandlerMiddleware = require("./middlewares/error-handler");
// const handlerRouters = require("./network/routers");

const init = () => {
  const app = express();

  return app
    .use(cors({}))
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use("/api/v2", router.init({ modules: [userModule] }));
};

export default { init };
