import { Module } from "../types";
import { Router } from "express";

const init = ({ modules }: { modules: Module[] }) => {
  const router = Router();

  modules.forEach((module) => {
    const { controller } = module;
    const methods = Object.keys(controller) as [];

    methods.forEach((method) => {
      router.use(controller[method]);
    });
  });

  return router;
};

export default {
  init,
};
