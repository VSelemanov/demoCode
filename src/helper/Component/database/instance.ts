import * as Sequelize from "sequelize";
import { IComponentInstance, IComponent, IComponentBase } from "../interfaces";
import ComponentSchema from "./models";

export default (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<
    IComponentInstance,
    IComponent,
    IComponentBase
  >("Component", ComponentSchema, {
    indexes: []
  });

  return instance;
};
