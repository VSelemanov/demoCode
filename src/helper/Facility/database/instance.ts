import * as Sequelize from "sequelize";
import {
  IFacilityInstance,
  IFacility,
  IFacilityBase,
  IFacilityPhotoItemInstance,
  IFacilityPhotoItem,
  IFacilityPhotoItemBase
} from "../interfaces";
import FacilitySchema from "./models";
import FacilityPhotoItemSchema from "./models/FacilityPhotoItem";

export default (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<
    IFacilityInstance,
    IFacility,
    IFacilityBase
  >("Facility", FacilitySchema, {
    indexes: []
  });

  return instance;
};

export const FacilityPhotoItemInstance = (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<
    IFacilityPhotoItemInstance,
    IFacilityPhotoItem,
    IFacilityPhotoItemBase
  >("FacilityPhotoItem", FacilityPhotoItemSchema, {
    indexes: []
  });

  return instance;
};
