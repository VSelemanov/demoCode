import * as Sequelize from "sequelize";
import { BaseInstanceInfo } from "modules/esb/app/src/database/constants";

const schema = {
  ...BaseInstanceInfo,
  code: {
    type: Sequelize.STRING(9)
  },
  parentGUID: {
    type: Sequelize.UUID,
    defaultValue: null
  },
  /*reportId: {
    type: Sequelize.UUID,
    allowNull: false
  },*/
  ReportFileGUID: {
    type: Sequelize.UUID,
    allowNull: false
  },
  params: {
    type: Sequelize.JSON
  }
};

export default schema;
