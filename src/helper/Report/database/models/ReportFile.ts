import * as Sequelize from "sequelize";
import { BaseInstanceInfo } from "modules/esb/app/src/database/constants";

const schema = {
  ...BaseInstanceInfo,
  code: {
    type: Sequelize.STRING(9)
  },
  UserGUID: {
    type: Sequelize.UUID,
    defaultValue: null
  },
  filename: {
    type: Sequelize.STRING,
    allowNull: false
  },
  extension: {
    type: Sequelize.STRING,
    allowNull: false
  },
  size: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  ReportGUID: {
    type: Sequelize.UUID,
    allowNull: false
  },
  version: {
    type: Sequelize.INTEGER
  }
};

export default schema;
