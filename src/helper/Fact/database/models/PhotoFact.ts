import * as Sequelize from "sequelize";
import { BaseInstanceInfo } from "../../../../database/constants";

const schema = {
  ...BaseInstanceInfo,
  FactGUID: {
    type: Sequelize.UUID,
    allowNull: false
  },
  Photo: {
    type: Sequelize.STRING,
    allowNull: false
  }
};

export default schema;
