import * as Sequelize from "sequelize";
import {
  BaseInstanceInfo,
  CIMSModelBase
  // CIMSReplaceId
} from "../../../../database/constants";

const schema = {
  ...BaseInstanceInfo,
  ...CIMSModelBase,
  // ...CIMSReplaceId,
  FacilityGUID: {
    type: Sequelize.UUID,
    allowNull: false
  },
  ProductType: {
    type: Sequelize.STRING
  },
  RegisterType: {
    type: Sequelize.STRING
    // allowNull: false
  },
  AssetType: {
    type: Sequelize.STRING
    // allowNull: false
  },
  RegisterApprovalBy: {
    type: Sequelize.STRING
    // allowNull: false
  },
  RegisterID: {
    type: Sequelize.INTEGER,
    allowNull: false
  },

  SystemIDList: {
    type: Sequelize.STRING
  },
  SpaceIDList: {
    type: Sequelize.STRING
  },
  RegisterName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  RegisterReference: {
    type: Sequelize.STRING
    // allowNull: false
  },
  ReplacementCost: {
    type: Sequelize.DOUBLE
  },
  ReplacementCostUnit: {
    type: Sequelize.STRING
  },
  ExpectedLife: {
    type: Sequelize.STRING
  },
  ExpectedLifeUnit: {
    type: Sequelize.STRING
  },
  ResourceGUID: {
    type: Sequelize.UUID,
    allowNull: false
  }
};

export default schema;
