import * as Sequelize from "sequelize";
import { BaseInstanceInfo } from "../../../../database/constants";

const schema = {
  ...BaseInstanceInfo,
  ComponentGUID: {
    type: Sequelize.UUID,
    allowNull: false
  },
  JobGUID: {
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
  uploadedAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  Comment: {
    type: Sequelize.STRING
  },
  Mark: {
    type: Sequelize.INTEGER
  },
  UserGUID: {
    type: Sequelize.STRING
  }
};

export default schema;
