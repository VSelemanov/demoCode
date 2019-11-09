import * as Sequelize from "sequelize";
import { IRegisterInstance, IRegister, IRegisterBase } from "../interfaces";
import RegisterSchema from "./models";

export default (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<
    IRegisterInstance,
    IRegister,
    IRegisterBase
  >("Register", RegisterSchema, {
    indexes: []
  });

  return instance;
};
