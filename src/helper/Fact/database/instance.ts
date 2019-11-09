import * as Sequelize from "sequelize";
import {
  IFactInstance,
  IFact,
  IFactBase,
  IPhotoFactInstance,
  IPhotoFactBase,
  IPhotoFact
} from "../interfaces";
import FactSchema from "./models";
import PhotoFactSchema from "./models/PhotoFact";

export default (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<IFactInstance, IFact, IFactBase>(
    "Fact",
    FactSchema,
    {
      indexes: []
    }
  );

  return instance;
};

export const photoFactInstance = (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<
    IPhotoFactInstance,
    IPhotoFact,
    IPhotoFactBase
  >("PhotoFact", PhotoFactSchema, {
    indexes: []
  });

  return instance;
};
