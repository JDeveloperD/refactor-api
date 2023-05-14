import { Request, Response, Router } from "express";
import userUsesCases from "../application/use-cases";
import mongoDBUserRepository from "./mongoDB- user-repository";

const route = Router();
const repository = mongoDBUserRepository();
const useCases = userUsesCases(repository);

const userController = {
  GetUsers: route.get("/users", async (_: Request, res: Response) => {
    const result = await useCases.findUsers();
    return res.json(result);
  }),
  GetUser: route.get("/users/:id", async (_req: Request, res: Response) => {
    return res.json("ok");
  }),
  CreateUser: route.post("/users", async (_req: Request, res: Response) => {
    return res.json("ok");
  }),
  DeleteUser: route.delete(
    "/users/:id",
    async (_req: Request, res: Response) => {
      return res.json("ok");
    }
  ),
};

export default userController;
