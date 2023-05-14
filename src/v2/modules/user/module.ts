import { Module } from "../../types";
import userController from "./infrastructure/user-controller";

const userModule: Module = {
  controller: userController,
};

export default userModule;
