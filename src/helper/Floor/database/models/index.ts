import * as Sequelize from "sequelize";
import {
  BaseInstanceInfo,
  CIMSModelBase,
  // CIMSReplaceId,
  CIMSFloorSpaceParams,
  ScheduleParams
} from "../../../../database/constants";

const schema = {
  ...BaseInstanceInfo,
  ...CIMSModelBase,
  ...ScheduleParams,
  // ...CIMSReplaceId,
  ...CIMSFloorSpaceParams,
  FacilityGUID: {
    type: Sequelize.UUID,
    allowNull: false
  },
  FloorID: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  FloorName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  FloorReferenceID: {
    type: Sequelize.STRING
  },
  FloorDescription: {
    type: Sequelize.TEXT
  },
  FloorElevation: {
    type: Sequelize.DOUBLE
  },
  FloorElevationUnits: {
    type: Sequelize.STRING
  },
  FloorTotalHeight: {
    type: Sequelize.DOUBLE
  },
  FloorTotalHeightUnits: {
    type: Sequelize.STRING
  },
  Status: {
    type: Sequelize.INTEGER
  }
};

export default schema;
