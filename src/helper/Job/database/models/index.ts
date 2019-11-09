import * as Sequelize from "sequelize";
import {
  BaseInstanceInfo,
  CIMSModelBase
  // CIMSReplaceId
} from "../../../../database/constants";

const schema = {
  ...BaseInstanceInfo,
  ENIRGUID: {
    type: Sequelize.STRING
  },
  GESNGUID: {
    type: Sequelize.STRING
  },
  JobID: {
    type: Sequelize.INTEGER
  },
  JobName: {
    type: Sequelize.STRING
  },
  // ResourceGUID: {
  //   type: Sequelize.UUID
  // },
  ParentGUID: {
    type: Sequelize.UUID
  },
  MeasureGUID: {
    type: Sequelize.UUID
  },
  ClassificationCode: {
    type: Sequelize.STRING,
    allowNull: false
  }
};

export default schema;
