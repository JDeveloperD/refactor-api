import { UserEntity, UserId } from "../domain/user-entity";
import { UserRepository } from "../domain/user-repository";
import validator from "validator";

const userUsesCases = (repository: UserRepository) => ({
  findUsers: async ({ criteria }: { criteria?: string } = {}) => {
    return repository.findAll();
  },
  findById: async ({ id }: { id: UserId }) => {},
  create: async (payload: UserEntity) => {
    const { email } = payload;

    if (!payload) return "Empty data user";

    if (email && !validator.isEmail(email)) return "Email invalid";

    await repository.create(payload);
  },
  update: async (payload: UserEntity) => {},
  delete: async ({ id }: { id: UserId }) => {},
});

export default userUsesCases;
