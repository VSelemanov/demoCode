import * as Sequelize from "sequelize";
import {
  BaseInstanceInfo,
  CIMSModelBase
  // CIMSReplaceId
} from "../../../../database/constants";

const schema = {
  ...BaseInstanceInfo,
  ...CIMSModelBase,

  ContactID: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ContactRole: {
    type: Sequelize.STRING
  },
  ExternalOfficeID: {
    type: Sequelize.STRING
  },
  GivenName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  FamilyName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  OfficeName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  OfficeDepartment: {
    type: Sequelize.STRING
  },
  OfficePrganizationCode: {
    type: Sequelize.STRING
  },
  AddressStreet: {
    type: Sequelize.STRING,
    allowNull: false
  },
  AddressPostalBox: {
    type: Sequelize.STRING
  },
  AddressTown: {
    type: Sequelize.STRING,
    allowNull: false
  },
  AddressStateRegion: {
    type: Sequelize.STRING,
    allowNull: false
  },
  AddressPostalCode: {
    type: Sequelize.STRING,
    allowNull: false
  },
  AddressCountry: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ContactPhone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ContactFax: {
    type: Sequelize.STRING
  },
  ContactEmail: {
    type: Sequelize.STRING,
    allowNull: false
  }
};

export default schema;
