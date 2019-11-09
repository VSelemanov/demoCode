import * as Sequelize from "sequelize";
import {
  BaseInstanceInfo,
  CIMSModelBase,
  ScheduleParams
} from "../../../../database/constants";

const schema = {
  ...BaseInstanceInfo,
  ...CIMSModelBase,
  ...ScheduleParams,
  FacilityName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  FacilityDescription: {
    type: Sequelize.TEXT
  },
  FacilityID: {
    type: Sequelize.INTEGER,
    allowNull: false
  },

  // TODO:  сделать ревизию всех полей
  code: {
    type: Sequelize.STRING(9)
  },
  address: {
    type: Sequelize.TEXT
  },
  FacilityClass: {
    type: Sequelize.STRING // TODO: Ввести справочники и изменить тип поля на uuid
  },
  FacilityType: {
    type: Sequelize.STRING // TODO: Ввести справочники и изменить тип поля на uuid
  },
  coordX: {
    type: Sequelize["DOUBLE PRECISION"]
  },
  coordY: {
    type: Sequelize["DOUBLE PRECISION"]
  },
  description: {
    type: Sequelize.TEXT
  },
  developer: {
    type: Sequelize.STRING // TODO: Ввести справочники и изменить тип поля на uuid
  },
  mainImg: {
    type: Sequelize.STRING
  },
  ProjectGUID: {
    type: Sequelize.UUID,
    allowNull: false
  },
  region: {
    type: Sequelize.STRING // TODO: Ввести справочники и изменить тип поля на uuid
  },
  stage: {
    type: Sequelize.STRING // TODO: Ввести справочники и изменить тип поля на uuid
  },
  additionalParams: {
    type: Sequelize.JSON
  },
  Status: {
    type: Sequelize.INTEGER
  },
  builder: {
    type: Sequelize.STRING
  },
  customer: {
    type: Sequelize.STRING
  }
};

export default schema;
