import * as Sequelize from "sequelize";

export const BaseInstanceInfo = {
  GUID: {
    type: Sequelize.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
};

export const CIMSModelBase = {
  ExternalSystemName: Sequelize.STRING,
  ExternalNameID: Sequelize.STRING,
  CreatedBy: Sequelize.UUID,
  Withdrawn: Sequelize.BOOLEAN
};

export const CIMSFloorSpaceParams = {
  ExteriorGrossArea: Sequelize.DOUBLE,
  ExteriorGrossAreaUnit: Sequelize.STRING,
  InteriorGrossArea: Sequelize.DOUBLE,
  InteriorGrossAreaUnit: Sequelize.STRING,
  PlannableGrossArea: Sequelize.DOUBLE,
  PlannableGrossAreaUnit: Sequelize.STRING,
  RentableAreaUsableArea: Sequelize.DOUBLE,
  RentableAreaUsableAreaUnits: Sequelize.STRING,
  InteriorPlannableArea: Sequelize.DOUBLE,
  InteriorPlannableAreaUnits: Sequelize.STRING,
  CalculationMethod: Sequelize.STRING
};

export const ScheduleParams = {
  startedAt: Sequelize.DATE,
  finishedAt: Sequelize.DATE
};
