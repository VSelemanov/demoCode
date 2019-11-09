import * as Sequelize from "sequelize";
import { BaseInstanceInfo } from "../../../../database/constants";

const schema = {
  ...BaseInstanceInfo,
  ComponentGUID: {
    type: Sequelize.UUID,
    allowNull: false
  },
  value: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  isResource: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  JobGUID: {
    type: Sequelize.UUID,
    allowNull: false
  }
};

export default schema;
