import { UserEntity, UserId } from "./user-entity";

export interface UserModel extends Omit<UserEntity, "id"> {
  _id: UserId;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRepository {
  create: (payload: UserEntity) => Promise<void>;
  findAll: (criteria?: string) => Promise<UserModel[]>;
  findById: (id: UserId) => Promise<UserModel | null>;
  update: (payload: UserEntity) => Promise<void>;
  delete: (id: UserId) => Promise<void>;
}
