import * as Sequelize from "sequelize";
import { IPlanInstance, IPlan, IPlanBase } from "../interfaces";
import PlanSchema from "./models";

export default (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<IPlanInstance, IPlan, IPlanBase>(
    "Plan",
    PlanSchema,
    {
      indexes: []
    }
  );

  return instance;
};
