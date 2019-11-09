import * as Sequelize from "sequelize";
import {
  BaseInstanceInfo,
  CIMSModelBase,
  ScheduleParams
} from "../../../../database/constants";

const schema = {
  ...BaseInstanceInfo,
  FacilityGUID: {
    type: Sequelize.UUID,
    allowNull: false
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false
  }
};

export default schema;
