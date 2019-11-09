import * as Sequelize from "sequelize";
import { BaseInstanceInfo } from "../../../../database/constants";

const schema = {
  ...BaseInstanceInfo,
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  isDeleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  orgId: {
    type: Sequelize.UUID,
    allowNull: false,
    unique: true
  },
  token: {
    type: Sequelize.UUID,
    allowNull: false
  }
};

export default schema;
