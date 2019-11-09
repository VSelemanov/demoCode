import * as Sequelize from "sequelize";
import {
  BaseInstanceInfo,
  CIMSModelBase,
  ScheduleParams
  // CIMSReplaceId
} from "../../../../database/constants";

const schema = {
  ...BaseInstanceInfo,
  ...CIMSModelBase,
  ...ScheduleParams,
  // ...CIMSReplaceId,
  ComponentID: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  FacilityGUID: {
    type: Sequelize.UUID
  },
  FloorGUID: {
    type: Sequelize.UUID
  },
  SpaceGUID: {
    type: Sequelize.UUID
  },
  SystemGUID: {
    type: Sequelize.UUID
  },
  RegisterGUID: {
    type: Sequelize.UUID,
    allowNull: false
  },
  ComponentName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // Count: {
  //   type: Sequelize.INTEGER
  //   // allowNull: false
  // },
  ComponentDescription: {
    type: Sequelize.STRING
  },
  Status: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
};

export default schema;
