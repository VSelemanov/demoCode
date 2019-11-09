import * as Sequelize from "sequelize";
import { BaseInstanceInfo } from "../../../../database/constants";

const schema = {
  ...BaseInstanceInfo,
  description: {
    type: Sequelize.TEXT
  },
  name: {
    type: Sequelize.STRING(150),
    allowNull: false
  },
  previewImg: {
    type: Sequelize.STRING
  },
  mainImg: {
    type: Sequelize.STRING
  },
  region: {
    type: Sequelize.STRING // TODO: Ввести справочники и изменить тип поля на uuid
  },
  town: {
    type: Sequelize.STRING // TODO: Ввести справочники и изменить тип поля на uuid
  },
  street: {
    type: Sequelize.STRING // TODO: Ввести справочники и изменить тип поля на uuid
  },
  FacilityCount: {
    type: Sequelize.INTEGER
  },
  totalArea: {
    type: Sequelize["DOUBLE PRECISION"]
  },
  ProjectStatus: {
    type: Sequelize.STRING
  },
  PlanFacilities: {
    type: Sequelize.INTEGER
  }
};

export default schema;
