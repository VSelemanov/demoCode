import * as Sequelize from "sequelize";
import { BaseInstanceInfo } from "../../../../database/constants";

const schema = {
  ...BaseInstanceInfo,
  name: {
    type: Sequelize.STRING(150),
    allowNull: false
  },
  ReportTypeGUID: {
    type: Sequelize.UUID,
    allowNull: false
  },
  orgId: {
    type: Sequelize.STRING
    // allowNull: false
  },
  dateFrom: {
    type: Sequelize.DATE
  },
  dateTo: {
    type: Sequelize.DATE
  }
};

export default schema;
