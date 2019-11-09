import * as Sequelize from "sequelize";

const schema = {
  id: {
    type: Sequelize.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  code: {
    type: Sequelize.STRING(9)
  },
  name: {
    type: Sequelize.STRING(150),
    allowNull: false
  },
  bimObjectId: {
    type: Sequelize.UUID
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
};

export default schema;
