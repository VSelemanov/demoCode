import * as Sequelize from "sequelize";
import { IProjectInstance, IProject, IProjectBase } from "../interfaces";
import ProjectSchema from "./models";

export default (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<IProjectInstance, IProject, IProjectBase>(
    "Project",
    ProjectSchema,
    {
      indexes: []
    }
  );

  return instance;
};
