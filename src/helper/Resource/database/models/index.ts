import * as Sequelize from "sequelize";
import { BaseInstanceInfo } from "../../../../database/constants";

const schema = {
  ...BaseInstanceInfo,
  KSRGUID: {
    type: Sequelize.STRING
  },
  ClassificationID: {
    type: Sequelize.INTEGER
  },
  ResourceID: {
    type: Sequelize.INTEGER
  },
  ResourceName: {
    type: Sequelize.STRING,
    allowNull: false
  },
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
