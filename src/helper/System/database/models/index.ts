import * as Sequelize from "sequelize";
import {
  BaseInstanceInfo,
  CIMSModelBase
} from "../../../../database/constants";

const schema = {
  ...BaseInstanceInfo,
  ...CIMSModelBase,
  SystemID: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  SystemName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  SystemReferenceID: {
    type: Sequelize.STRING
    // allowNull: false
  },
  SystemDescription: {
    type: Sequelize.STRING
  },
  SystemFunction: {
    type: Sequelize.STRING
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
  Status: {
    type: Sequelize.INTEGER
  }
};

export default schema;
