import * as Sequelize from "sequelize";
import { BaseInstanceInfo } from "../../../../database/constants";

const schema = {
  ...BaseInstanceInfo,
  MeasureID: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  MeasureName: {
    type: Sequelize.STRING,
    allowNull: false
  }
};

export default schema;
