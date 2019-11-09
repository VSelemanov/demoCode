import * as Sequelize from "sequelize";
import { BaseInstanceInfo } from "modules/esb/app/src/database/constants";

const schema = {
  ...BaseInstanceInfo,
  code: {
    type: Sequelize.STRING(9)
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  example: {
    type: Sequelize.STRING
  }
};

export default schema;
