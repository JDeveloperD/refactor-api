import {} from "mongoose";

export type UserId = string;

export interface UserEntity {
  id: UserId;
  name: string | null;
  email: string;
  password: string;
  phone: string | null;
}
