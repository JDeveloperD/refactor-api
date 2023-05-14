import {
  UserModel as UserModelI,
  UserRepository,
} from "../domain/user-repository";
import UserModel from "./user-model";
import bcryptjs from "bcryptjs";
import { UserEntity } from "../domain/user-entity";

const mongoDBUserRepository = (): UserRepository => {
  return {
    async create(payload: UserEntity): Promise<void> {
      const user = new UserModel(payload);
      const encrypt = await bcryptjs.genSalt(10);

      user._id = payload.id;
      user.password = await bcryptjs.hash(user.password, encrypt);
      user.save();
    },
    delete(): Promise<void> {
      return Promise.resolve(undefined);
    },
    findAll(criteria: string | undefined): Promise<UserModelI[]> {
      return UserModel.find();
    },
    findById(): Promise<UserModelI | null> {
      return Promise.resolve(null);
    },
    update(): Promise<void> {
      return Promise.resolve(undefined);
    },
  };
};

export default mongoDBUserRepository;
