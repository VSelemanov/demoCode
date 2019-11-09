import * as Sequelize from "sequelize";
import { IContactInstance, IContact, IContactBase } from "../interfaces";
import ContactSchema from "./models";

export default (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<IContactInstance, IContact, IContactBase>(
    "Contact",
    ContactSchema,
    {
      indexes: []
    }
  );

  return instance;
};
