import * as Sequelize from "sequelize";
import { ISystemInstance, ISystem, ISystemBase } from "../interfaces";
import SystemSchema from "./models";

export default (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<ISystemInstance, ISystem, ISystemBase>(
    "System",
    SystemSchema,
    {
      indexes: []
    }
  );

  return instance;
};
