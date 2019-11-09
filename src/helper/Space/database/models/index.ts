import * as Sequelize from "sequelize";
import {
  BaseInstanceInfo,
  CIMSModelBase,
  CIMSFloorSpaceParams,
  ScheduleParams
} from "../../../../database/constants";

const schema = {
  ...BaseInstanceInfo,
  ...CIMSModelBase,
  ...CIMSFloorSpaceParams,
  ...ScheduleParams,
  SpaceID: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  FloorGUID: {
    type: Sequelize.UUID,
    allowNull: false
  },
  SpaceFunction: {
    type: Sequelize.STRING
  },
  SpaceNumber: {
    type: Sequelize.STRING
  },

  SpaceName: {
    type: Sequelize.STRING
  },
  SpaceDescription: {
    type: Sequelize.TEXT
  },
  SpaceUsableHeight: {
    type: Sequelize.DOUBLE
  },
  SpaceUsableHeightUnits: {
    type: Sequelize.STRING
  },
  Status: {
    type: Sequelize.INTEGER
  }
};

export default schema;
