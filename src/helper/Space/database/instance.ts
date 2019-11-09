import * as Sequelize from "sequelize";
import { ISpaceInstance, ISpace, ISpaceBase } from "../interfaces";
import SpaceSchema from "./models";

export default (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<ISpaceInstance, ISpace, ISpaceBase>(
    "Space",
    SpaceSchema,
    {
      indexes: []
    }
  );

  return instance;
};
