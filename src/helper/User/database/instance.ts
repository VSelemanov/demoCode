import * as Sequelize from "sequelize";
import { IUserInstance, IUser, IUserBase } from "../interfaces";
import UserSchema from "./models";

export default (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<IUserInstance, IUser, IUserBase>(
    "User",
    UserSchema,
    {
      indexes: []
    }
  );

  return instance;
};
