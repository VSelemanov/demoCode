import * as Sequelize from "sequelize";
import { IMeasureInstance, IMeasure, IMeasureBase } from "../interfaces";
import MeasureSchema from "./models";

export default (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<IMeasureInstance, IMeasure, IMeasureBase>(
    "Measure",
    MeasureSchema,
    {
      indexes: []
    }
  );

  return instance;
};
