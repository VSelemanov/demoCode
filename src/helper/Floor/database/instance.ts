import * as Sequelize from "sequelize";
import { IFloorInstance, IFloor, IFloorBase } from "../interfaces";
import FloorSchema from "./models";

export default (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<IFloorInstance, IFloor, IFloorBase>(
    "Floor",
    FloorSchema,
    {
      indexes: []
    }
  );

  return instance;
};
